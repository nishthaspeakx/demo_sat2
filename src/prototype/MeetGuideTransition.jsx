import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * MeetGuideTransition — one continuous camera move from the Sia scene into the
 * Guide scene. Phases:
 *   zoom   : sia-bg pushes forward (scale + blur), Sia fades after 300ms
 *   video  : guide-transition.mp4 crossfades in over the zooming bg, plays
 *   settle : video shrinks + fades while guide-bg grows in to settle
 * Then onComplete() → GuideConversationScreen (same guide-bg → seamless).
 *
 * Layer z-order: sia(10) < guide-bg(20) < video(30).
 */
export default function MeetGuideTransition({ onComplete, fallbackMs = 4000 }) {
  const [phase, setPhase] = useState("zoom"); // zoom | video | settle
  const done = useRef(false);

  // zoom → video after 600ms
  useEffect(() => {
    const t = setTimeout(() => setPhase("video"), 600);
    return () => clearTimeout(t);
  }, []);

  // hard fallback: if the video never ends/loads, force the settle
  useEffect(() => {
    const t = setTimeout(() => goSettle(), fallbackMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goSettle() {
    if (done.current) return;
    done.current = true;
    setPhase("settle");
    setTimeout(() => onComplete(), 550);
  }

  return (
    <motion.div
      key="meet-transition"
      className="absolute inset-0 overflow-hidden bg-black"
    >
      {/* ---- sia layer (bg + white fade + Sia) ---- */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        animate={
          phase === "zoom"
            ? { scale: 1.18, opacity: 0.95, filter: "blur(2px)" }
            : { scale: 1.24, opacity: 0, filter: "blur(4px)" }
        }
        transition={{ duration: phase === "zoom" ? 0.7 : 0.5, ease: "easeInOut" }}
      >
        <img src="/assets/sia_2.png" alt="" aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center" draggable={false} />
        <motion.img
          src="/assets/sia.png" alt="" aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          className="absolute left-1/2 top-[4%] h-[34%] w-auto -translate-x-1/2 object-contain"
          draggable={false}
        />
        <div className="absolute inset-0" style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,0.6) 32%, rgba(255,255,255,0.95) 38%, #ffffff 44%)",
        }} />
      </motion.div>

      {/* ---- guide-bg layer (settles in behind the video) ---- */}
      <motion.img
        src="/assets/guide_2.png" alt="" aria-hidden
        className="absolute inset-0 z-20 h-full w-full object-cover object-center"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={phase === "settle" ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        draggable={false}
      />

      {/* ---- video layer (crossfades in, then shrinks away) ---- */}
      <motion.div
        className="absolute inset-0 z-30"
        initial={{ opacity: 0, scale: 1 }}
        animate={
          phase === "zoom"
            ? { opacity: 0, scale: 1 }
            : phase === "video"
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.94 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <video
          src="/assets/guide-transition.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={goSettle}
          onError={goSettle}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
