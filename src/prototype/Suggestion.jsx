import React from "react";
import { motion } from "framer-motion";

/**
 * Suggestion — the "You can try saying" hint card (English + translation).
 * Tap the card to use it; × to hide.
 */
export default function Suggestion({ english, translation, onHide, onUse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl border border-dashed border-stone-300 bg-[#FFFBF2] px-4 py-3"
    >
      <button
        type="button"
        onClick={onHide}
        aria-label="Hide hint"
        className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-stone-100 text-stone-500"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
        You can try saying
      </p>
      <button type="button" onClick={onUse} className="block w-full pr-6 text-left">
        <p className="text-[14px] font-semibold leading-snug text-stone-800">{english}</p>
        {translation && (
          <p className="mt-1.5 text-[13px] leading-snug text-stone-500">{translation}</p>
        )}
      </button>
    </motion.div>
  );
}
