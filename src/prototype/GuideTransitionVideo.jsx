import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * GuideTransitionVideo — full-screen 9:16 transition clip played after the user
 * taps "Meet Guide". No UI on top. Advances when the video ends, with a timeout
 * fallback in case onEnded never fires or the video fails to load.
 */
export default function GuideTransitionVideo({ onEnd, fallbackMs = 4000 }) {
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onEnd();
  };

  useEffect(() => {
    const t = setTimeout(finish, fallbackMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key="transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-50 bg-black"
    >
      <video
        src="/assets/guide-transition.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
