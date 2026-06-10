import React from "react";
import { motion } from "framer-motion";
import { MicIcon, BRAND_ORANGE } from "./icons.jsx";

/**
 * BottomMicInput — grey text field + orange mic. Shows a listening pulse + label
 * while `listening` is true.
 */
export default function BottomMicInput({ listening, onMic }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-black/5 bg-white/95 px-4 pb-5 pt-3 backdrop-blur"
    >
      {listening && (
        <div className="mb-2 flex items-center justify-center gap-2 text-[12px] font-semibold text-orange-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          Listening…
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message"
          className="h-[52px] min-w-0 flex-1 rounded-full bg-[#F3F3F3] px-5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none"
        />
        <button
          type="button"
          onClick={onMic}
          aria-label="Speak"
          className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full text-white shadow-[0_8px_18px_rgba(242,121,43,0.45)] transition active:scale-95"
          style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
        >
          {listening && (
            <span className="absolute inset-0 animate-ping rounded-full bg-orange-400/50" />
          )}
          <MicIcon className="relative h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
}
