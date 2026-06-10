import React, { useState } from "react";
import Suggestion from "./Suggestion.jsx";

/**
 * BottomPanel — Variant B  ("Big talk button" / speaking-first)
 * Hint card on top; the large mic CTA owns the rest. Tapping Show Hint swaps
 * the card for the suggestion and the panel grows to fit.
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

function KeyboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </svg>
  );
}

export default function BottomPanelB({ onMic, onType, defaultHintOpen = false }) {
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

      {/* big talk action — vertically centered to fill the panel */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onType}
          aria-label="Type instead"
          className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-2xl bg-[#F5F5F5] text-stone-500 ring-1 ring-black/[0.04] transition active:scale-95"
        >
          <KeyboardIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={onMic}
          className="relative flex h-[56px] flex-1 items-center justify-center gap-3 rounded-2xl text-white shadow-[0_10px_24px_rgba(242,121,43,0.45)] transition active:scale-[0.98]"
          style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
        >
          <span className="relative grid h-9 w-9 place-items-center">
            <span className="mic-pulse-ring absolute inset-0 rounded-full bg-white/70" aria-hidden />
            <MicIcon className="relative h-6 w-6" />
          </span>
          <span className="text-[16px] font-semibold tracking-wide">Tap to speak</span>
        </button>
      </div>
    </div>
  );
}
