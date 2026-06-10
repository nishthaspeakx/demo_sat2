import React from "react";

/**
 * Suggestion — the "hint shown" card revealed when the learner taps Show Hint.
 * Premium take on the sample: dashed card + brand accent, an uppercase eyebrow,
 * a bold English model answer, its translation, and Listen / Hide controls.
 */

const BRAND_ORANGE = "#F2792B";

function SpeakerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Suggestion({
  english = "Yes, I've purchased a saree before — it was a thoughtful and enjoyable experience, and ultimately very satisfying.",
  translation = "हाँ, मैंने पहले एक साड़ी खरीदी है — यह एक सोच-समझकर लिया गया और सुखद अनुभव था, जो अंततः बहुत संतोषजनक रहा।",
  onListen,
  onHide,
  onUse,
  fill = false,
}) {
  return (
    <div className={[
      "relative overflow-auto rounded-2xl border border-dashed border-amber-300/80 bg-[#FFFBF2] px-4 py-3 shadow-sm",
      fill ? "flex h-full flex-col" : "",
    ].join(" ")}>
      {/* brand accent bar */}
      <span
        className="absolute inset-y-2 left-0 w-1 rounded-full"
        style={{ backgroundColor: BRAND_ORANGE }}
        aria-hidden
      />

      <div className="mb-1.5 flex items-center justify-between pl-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600/90">
          💡 You can try saying
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onListen}
            aria-label="Listen to the suggested answer"
            className="grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-amber-700 transition active:scale-90"
          >
            <SpeakerIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onHide}
            aria-label="Hide hint"
            className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-stone-500 transition active:scale-90"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <button type="button" onClick={onUse} className="block w-full pl-2 text-left">
        <p className="text-[14px] font-semibold leading-snug text-stone-800">
          {english}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-stone-500">
          {translation}
        </p>
      </button>
    </div>
  );
}
