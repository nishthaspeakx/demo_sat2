import React from "react";
import { motion } from "framer-motion";
import { useRandomBlink } from "./useRandomBlink.js";

/**
 * AnimatedCharacter — keeps a PNG/SVG character "alive": idle breathing, blink,
 * lip-sync while speaking, nod while listening, small expression bounces.
 *
 * Layout: the passed `className` positions + sizes the OUTER box (it should set
 * height + absolute positioning, e.g. "absolute left-1/2 top-[4%] h-[34%]
 * -translate-x-1/2"). Centering stays on the outer box; Framer transforms run on
 * an inner wrapper so they never fight the -translate-x-1/2.
 *
 * Props:
 *   type: "sia" | "guide"
 *   src: image url
 *   state: "idle" | "speaking" | "listening" | "thinking" | "success"
 *   emotion: "neutral" | "happy" | "excited" | "encouraging"
 */

// per-character overlay placement (relative to the image box) — tune visually
const avatarConfig = {
  // Sia cutout ~355x585: eyes ~26%, lips ~36% of image height
  sia: {
    mouth: { top: "43%", left: "50%", width: 22, height: 7, color: "#b05a52" },
    eyes: [
      { top: "30%", left: "45%", w: 15, h: 11 },
      { top: "30%", left: "55%", w: 15, h: 11 },
    ],
    eyelid: "#eec3a1",
  },
  // Guide SVG 360x460: eyes cy148 (~32%), mouth ~42%, eyes cx 156/204 (~43/57%)
  guide: {
    mouth: { top: "41%", left: "50%", width: 18, height: 6, color: "#7a3b2e" },
    eyes: [
      { top: "31%", left: "43.5%", w: 13, h: 10 },
      { top: "31%", left: "56.5%", w: 13, h: 10 },
    ],
    eyelid: "#c8895b",
  },
};

const VARIANTS = {
  idle: { scale: [1, 1.012, 1], rotate: [-0.3, 0.3, -0.3], y: [0, -1, 0] },
  speaking: { y: [0, 1.5, 0], rotate: [-0.6, 0.6, -0.3] },
  listening: { y: [0, 3, 0], rotate: [0, 1.2, 0] },
  thinking: { rotate: [0, -2, 0], y: [0, 1, 0] },
  success: { y: [0, -6, 0], scale: [1, 1.03, 1] },
};
const TRANSITIONS = {
  idle: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  speaking: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
  listening: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
  thinking: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  success: { duration: 0.6, ease: "easeOut" },
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
  const blinking = useRandomBlink();
  const motionKey = VARIANTS[state] ? state : "idle";
  const speaking = state === "speaking";

  return (
    <div className={className}>
      <motion.div
        className="relative h-full w-fit"
        style={{ transformOrigin: "center bottom" }}
        animate={VARIANTS[motionKey]}
        transition={TRANSITIONS[motionKey]}
      >
        <img src={src} alt={type} className={imgClassName} draggable={false} />

        {/* blink eyelids */}
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
              transition: "transform 90ms ease, opacity 90ms ease",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* lip-sync mouth */}
        <span
          aria-hidden
          className={`character-mouth ${speaking ? "speaking" : ""}`}
          style={{
            top: cfg.mouth.top,
            left: cfg.mouth.left,
            width: cfg.mouth.width,
            height: cfg.mouth.height,
            background: cfg.mouth.color,
          }}
        />
      </motion.div>
    </div>
  );
}
