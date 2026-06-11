import React from "react";
import { motion } from "framer-motion";
import { useRandomBlink } from "./useRandomBlink.js";

/**
 * AnimatedCharacter — one coordinated facial controller.
 *
 * Priorities (never all strong at once):
 *   1. lip-sync (only while speaking)  2. expression/state  3. blink  4. head
 *
 * Design choices for a natural look:
 *   - Head motion is tiny and state-dependent (idle ≈ still). No pendulum.
 *   - Lip-sync animates a small mouth opening anchored at the lip CENTRE
 *     (translate(-50%,-50%) + height in px, capped) so it never leaves the
 *     jaw or scales the face.
 *   - Blinks are eased + randomized (see useRandomBlink), paused on success.
 *   - State changes interpolate (Framer transitions) — no instant jumps.
 *
 * Layout: `className` positions/sizes the OUTER box; Framer transforms run on an
 * inner wrapper so they never fight the -translate-x-1/2 centering.
 */

const avatarConfig = {
  sia: {
    mouth: { top: "47.5%", left: "50%", width: 20, maxH: 7, color: "#7c3f39" },
    eyes: [
      { top: "30%", left: "45%", w: 15, h: 10 },
      { top: "30%", left: "55%", w: 15, h: 10 },
    ],
    eyelid: "#eec3a1",
  },
  guide: {
    mouth: { top: "41%", left: "50%", width: 16, maxH: 6, color: "#5e2c24" },
    eyes: [
      { top: "31%", left: "43.5%", w: 12, h: 9 },
      { top: "31%", left: "56.5%", w: 12, h: 9 },
    ],
    eyelid: "#c8895b",
  },
};

// subtle, coordinated head motion per state (amplitudes are intentionally tiny)
const BODY = {
  idle: { animate: { scale: [1, 1.006, 1], y: 0, rotate: 0 }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
  speaking: { animate: { y: [0, -0.8, 0], rotate: [0, 0.25, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } },
  listening: { animate: { y: [0, 1.6, 0], rotate: 0 }, transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } },
  thinking: { animate: { rotate: -1.4, y: 0 }, transition: { duration: 0.6, ease: "easeInOut" } },
  success: { animate: { y: [0, -5, 0], scale: [1, 1.02, 1] }, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AnimatedCharacter({
  type = "sia",
  src,
  state = "idle",
  emotion = "neutral",
  className = "",
  imgClassName = "h-full w-auto object-contain",
}) {
  const cfg = avatarConfig[type] || avatarConfig.sia;
  const speaking = state === "speaking";
  const blinking = useRandomBlink(state !== "success"); // no blink on expression peak
  const body = BODY[state] || BODY.idle;

  // small, contained viseme openings (closed → slight → medium → wide)
  const m = cfg.mouth;
  const visemes = [2, m.maxH * 0.55, m.maxH * 0.35, m.maxH, 2];

  return (
    <div className={className}>
      <motion.div
        className="relative h-full w-fit"
        style={{ transformOrigin: "center 75%" }}
        animate={body.animate}
        transition={body.transition}
      >
        <img src={src} alt={type} className={imgClassName} draggable={false} />

        {/* blink eyelids — eased, anchored on the eyes */}
        {cfg.eyes.map((e, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              top: e.top,
              left: e.left,
              width: e.w,
              height: e.h,
              marginLeft: -e.w / 2,
              borderRadius: "50%",
              background: cfg.eyelid,
              transformOrigin: "center top",
              transform: `scaleY(${blinking ? 1 : 0})`,
              opacity: blinking ? 1 : 0,
              transition:
                "transform 120ms cubic-bezier(.4,0,.2,1), opacity 120ms ease",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* lip-sync — small opening centred on the lips, never leaves the jaw */}
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            top: m.top,
            left: m.left,
            width: m.width,
            transform: "translate(-50%, -50%)",
            borderRadius: 999,
            background: m.color,
            pointerEvents: "none",
          }}
          initial={false}
          animate={speaking ? { height: visemes, opacity: 0.8 } : { height: 2, opacity: 0 }}
          transition={
            speaking
              ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.25, ease: "easeOut" }
          }
        />
      </motion.div>
    </div>
  );
}
