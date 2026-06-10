import React from "react";
import { motion } from "framer-motion";

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

/**
 * ProgressTracker — 3 task circles connected by lines. Circles turn green with
 * an animated tick as `completed` increases. All grey at completed = 0.
 */
export default function ProgressTracker({ completed = 0, total = 3 }) {
  return (
    <div className="flex items-center px-12">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < completed;
        const isLast = i === total - 1;
        return (
          <React.Fragment key={i}>
            <motion.span
              initial={false}
              animate={done ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={[
                "grid h-6 w-6 shrink-0 place-items-center rounded-full ring-2 ring-white/80 shadow",
                done ? "bg-emerald-500" : "bg-white/55",
              ].join(" ")}
            >
              {done && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Check />
                </motion.span>
              )}
            </motion.span>
            {!isLast && (
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/55">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                  initial={false}
                  animate={{ width: i < completed ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
