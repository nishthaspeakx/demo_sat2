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
      className="w-full self-start rounded-2xl bg-[#FFF7EC] p-4 shadow-md ring-1 ring-amber-100"
    >
      <h3 className="mb-3.5 text-[16px] font-bold text-orange-500">{heading}</h3>
      <div className="space-y-3">
        {OPTIONS.map((o, i) => {
          const chosen = sel === i;
          const correct = i === CORRECT;
          let cls = "border-transparent bg-white text-stone-700 ring-1 ring-black/5";
          if (chosen && correct)
            cls = "border-emerald-400 bg-emerald-50 text-emerald-800 ring-0";
          else if (chosen && !correct)
            cls = "border-red-300 bg-red-50 text-red-700 ring-0";
          else if (chosen)
            cls = "border-orange-400 bg-orange-50 text-stone-800 shadow-[0_0_0_3px_rgba(242,121,43,0.15)] ring-0";
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={`w-full rounded-2xl border-2 px-4 py-3.5 text-left text-[15px] font-medium transition active:scale-[0.99] ${cls}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
