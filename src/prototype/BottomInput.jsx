import React from "react";

const BRAND_ORANGE = "#F2792B";

function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

export default function BottomInput({ onMic }) {
  return (
    <div className="flex items-center gap-3 border-t border-black/5 bg-white px-4 pb-5 pt-3">
      <input
        type="text"
        placeholder="Type a message"
        className="h-[52px] min-w-0 flex-1 rounded-full bg-[#F3F3F3] px-5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-orange-300/60 transition"
      />
      <button
        type="button"
        onClick={onMic}
        aria-label="Speak"
        className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full text-white shadow-[0_8px_18px_rgba(242,121,43,0.45)] transition active:scale-95"
        style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
      >
        <MicIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
