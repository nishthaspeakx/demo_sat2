import React, { useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_OPTIONS = ["I am looking for guide.", "I looking for guide."];

/**
 * MCQCard — tap an option; on the correct one, briefly highlight green then
 * call onCorrect(text). Heading/options/correctIndex are configurable.
 */
export default function MCQCard({
  onCorrect,
  heading = "How will you ask for guide?",
  options = DEFAULT_OPTIONS,
  correctIndex = 0,
}) {
  const OPTIONS = options;
  const CORRECT = correctIndex;
  const [sel, setSel] = useState(null);
  const [locked, setLocked] = useState(false);

  function pick(i) {
    if (locked) return;
    setSel(i);
    if (i === CORRECT) {
      setLocked(true);
      setTimeout(() => onCorrect(OPTIONS[CORRECT]), 600);
    }
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full self-start rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5"
    >
      <h3 className="mb-3 text-[15px] font-semibold text-stone-800">{heading}</h3>
      <div className="space-y-2.5">
        {OPTIONS.map((o, i) => {
          const chosen = sel === i;
          const correct = i === CORRECT;
          let cls = "border-stone-200 bg-white text-stone-700";
          if (chosen && correct) cls = "border-emerald-400 bg-emerald-50 text-emerald-800";
          else if (chosen && !correct) cls = "border-red-300 bg-red-50 text-red-700";
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[14px] transition active:scale-[0.99] ${cls}`}
            >
              <span
                className={[
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                  chosen && correct ? "border-emerald-500 bg-emerald-500" : "",
                  chosen && !correct ? "border-red-400" : "",
                  !chosen ? "border-stone-300" : "",
                ].join(" ")}
              >
                {chosen && correct && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
