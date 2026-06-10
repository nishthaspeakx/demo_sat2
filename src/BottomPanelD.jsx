import React, { useState } from "react";
import Suggestion from "./Suggestion.jsx";

/**
 * BottomPanel — Variant D
 * Same fixed, static block height as the default. The mic lives ONLY beside the
 * text box (like the classic input row). The middle gap is filled with a calm,
 * static "Your turn to speak" prompt — no large central button.
 */

const BRAND_ORANGE = "#F2792B";

const SUGGESTION =
  "Yes, I've purchased a saree before — it was a thoughtful and enjoyable experience, and ultimately very satisfying.";

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

export default function BottomPanelD({ onMic, defaultHintOpen = false }) {
  const [hintOpen, setHintOpen] = useState(defaultHintOpen);
  const [value, setValue] = useState("");

  return (
    <div className="flex h-full flex-col rounded-t-3xl bg-white px-4 pb-4 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      {/* hint region — fixed area; content swaps in place */}
      <div className="flex min-h-0 flex-1 flex-col">
        {hintOpen ? (
          <Suggestion
            fill
            english={SUGGESTION}
            onHide={() => setHintOpen(false)}
            onUse={() => {
              setValue(SUGGESTION);
              setHintOpen(false);
            }}
          />
        ) : (
          <>
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

            {/* static prompt — no central button, mic stays by the input */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
              <span
                className="grid h-12 w-12 place-items-center rounded-full"
                style={{ background: "radial-gradient(circle at 50% 38%, #FDEEE0, #FBDDC6)" }}
              >
                <MicIcon className="h-6 w-6" style={{ color: BRAND_ORANGE }} />
              </span>
              <span className="text-[15px] font-semibold text-stone-700">Your turn to speak</span>
            </div>
          </>
        )}
      </div>

      {/* input row — mic sits next to the text box */}
      <div className="mt-3 flex shrink-0 items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Say or type your answer..."
          className="h-[52px] min-w-0 flex-1 rounded-full bg-[#F5F5F5] px-5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none ring-1 ring-black/[0.04] focus:ring-2 focus:ring-orange-300/60 transition"
        />
        <div className="relative h-[52px] w-[52px] shrink-0">
          <span className="mic-pulse-ring absolute inset-0 rounded-full"
            style={{ backgroundColor: BRAND_ORANGE }} aria-hidden />
          <button
            type="button"
            onClick={onMic}
            aria-label="Speak your answer"
            className="relative grid h-full w-full place-items-center rounded-full text-white shadow-[0_8px_20px_rgba(242,121,43,0.45)] transition active:scale-95"
            style={{ background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})` }}
          >
            <MicIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
