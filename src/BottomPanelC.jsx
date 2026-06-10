import React, { useState } from "react";
import Suggestion from "./Suggestion.jsx";

/**
 * BottomPanel — Variant C  ("Embedded mic + live waveform")
 * Hint card on top, response label, and a tall pill (placeholder + waveform +
 * embedded mic). Tapping Show Hint reveals the suggestion above the pill.
 */

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

function Waveform() {
  const bars = [0, 0.15, 0.3, 0.45, 0.3, 0.15, 0];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {bars.map((delay, i) => (
        <span
          key={i}
          className="wave-bar h-full w-[3px] rounded-full"
          style={{ backgroundColor: BRAND_ORANGE, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

export default function BottomPanelC({ onMic, value, onChange, defaultHintOpen = false }) {
  const [hintOpen, setHintOpen] = useState(defaultHintOpen);

  return (
    <div className="flex h-full min-h-full flex-col rounded-t-3xl bg-white px-4 pb-4 pt-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      {/* hint area (top) */}
      {hintOpen ? (
        <Suggestion onHide={() => setHintOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setHintOpen(true)}
          className="flex h-11 w-full shrink-0 items-center gap-2.5 rounded-xl border border-amber-200/80 bg-[#FFF8E8] px-3.5 text-left shadow-sm transition active:scale-[0.99]"
        >
          <span className="text-base leading-none">💡</span>
          <span className="text-[13px] font-medium text-stone-700">Need help?</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-amber-600">
            Show Hint <span aria-hidden className="text-amber-500">→</span>
          </span>
        </button>
      )}

      {/* response section pinned to bottom; label sits comfortably above */}
      <div className="mt-auto">
        <div className="mb-2.5 flex items-center gap-1.5">
          <span className="text-[13px] leading-none">🎙️</span>
          <span className="text-[14px] font-medium text-stone-600">Your turn — speak to Sia</span>
        </div>

        <div className="flex h-[60px] items-center gap-2 rounded-full bg-[#F5F5F5] py-2 pl-5 pr-2 ring-1 ring-black/[0.04] focus-within:ring-2 focus-within:ring-orange-300/60 transition">
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Say or type your answer..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-stone-800 placeholder:text-stone-400 outline-none"
          />
          <Waveform />
          <div className="relative h-11 w-11 shrink-0">
            <span className="mic-pulse-ring absolute inset-0 rounded-full"
              style={{ backgroundColor: BRAND_ORANGE }} aria-hidden />
            <button
              type="button"
              onClick={onMic}
              aria-label="Speak your answer"
              className="relative grid h-full w-full place-items-center rounded-full text-white shadow-[0_8px_18px_rgba(242,121,43,0.5)] transition active:scale-95"
              style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
            >
              <MicIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
