import React from "react";
import { motion } from "framer-motion";

/**
 * GuideScreen — placeholder shown after the transition video. Same Taj-style
 * background with a guide character area. Real guide + conversation come later.
 */
export default function GuideScreen() {
  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 overflow-hidden bg-white"
    >
      <img
        src="/assets/taj.jpg"
        alt="Taj Mahal"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 62%, #ffffff 80%)",
        }}
      />

      {/* guide character placeholder */}
      <div className="absolute inset-x-0 bottom-0 top-[42%] z-10 flex flex-col items-center px-6">
        <div className="grid h-40 w-40 place-items-center rounded-full border-2 border-dashed border-stone-300 bg-white/70 text-stone-400 shadow-sm backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
        <p className="mt-5 text-[18px] font-bold text-stone-800">Meet your guide</p>
        <p className="mt-1 text-[13px] text-stone-500">Guide character coming soon…</p>
      </div>
    </motion.div>
  );
}
