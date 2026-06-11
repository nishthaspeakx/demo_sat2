import React, { useState } from "react";
import { motion } from "framer-motion";
import { MicIcon, BRAND_ORANGE } from "./icons.jsx";

function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

/**
 * BottomMicInput — real speech (mic) OR typed answer.
 * - Tap mic → onMic() starts speech recognition (parent shows `listening`).
 * - Type + Enter / send → onSubmit(text).
 */
export default function BottomMicInput({ listening, onMic, onSubmit }) {
  const [val, setVal] = useState("");
  const hasText = val.trim().length > 0;

  function submit() {
    const t = val.trim();
    if (!t) return;
    setVal("");
    onSubmit && onSubmit(t);
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-black/5 bg-white/95 px-4 pb-5 pt-3 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        {listening ? (
          <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full bg-orange-50 px-5 ring-1 ring-orange-200">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400/70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
            </span>
            <span className="text-[14px] font-semibold text-orange-600">Listening… speak now</span>
          </div>
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Speak or type your answer…"
            className="h-[52px] min-w-0 flex-1 rounded-full bg-[#F3F3F3] px-5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none"
          />
        )}
        {hasText && !listening ? (
          <button
            type="button"
            onClick={submit}
            aria-label="Send"
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full text-white shadow-[0_8px_18px_rgba(242,121,43,0.45)] transition active:scale-95"
            style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        ) : (
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
        )}
      </div>
    </motion.div>
  );
}
