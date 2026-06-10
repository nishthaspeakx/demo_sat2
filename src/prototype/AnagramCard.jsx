import React, { useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_ANSWER = ["What", "will", "be", "the", "cost?"];
const DEFAULT_SCRAMBLED = ["the", "cost?", "What", "be", "will"];

/**
 * AnagramCard — "Arrange the sentence". Tap chips into the answer box, Undo,
 * Check. answer/scrambled chips and the final sentence are configurable.
 */
export default function AnagramCard({
  onDone,
  answer = DEFAULT_ANSWER,
  scrambled = DEFAULT_SCRAMBLED,
  sentence,
}) {
  const ANSWER = answer;
  const SCRAMBLED = scrambled;
  const FINAL = sentence || answer.join(" ");
  // each chip: { id, text }
  const [bank, setBank] = useState(SCRAMBLED.map((t, i) => ({ id: i, text: t })));
  const [placed, setPlaced] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | wrong | done

  function addChip(chip) {
    if (status === "done") return;
    setBank((b) => b.filter((c) => c.id !== chip.id));
    setPlaced((p) => [...p, chip]);
    setStatus("idle");
  }
  function undo() {
    if (!placed.length || status === "done") return;
    const last = placed[placed.length - 1];
    setPlaced((p) => p.slice(0, -1));
    setBank((b) => [...b, last]);
    setStatus("idle");
  }
  function check() {
    if (status === "done") return;
    const sentence = placed.map((c) => c.text).join(" ");
    if (sentence === ANSWER.join(" ")) {
      setStatus("done");
      // correct → drop the sentence straight into the chat
      setTimeout(() => onDone(FINAL), 350);
    } else {
      setStatus("wrong");
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
      <h3 className="mb-3 text-[14px] font-semibold text-orange-500">
        Arrange the sentence
      </h3>

      {/* answer box */}
      <div
        className={[
          "mb-3 flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2",
          status === "wrong"
            ? "border-red-300 bg-red-50"
            : status === "done"
            ? "border-emerald-300 bg-emerald-50"
            : "border-stone-200 bg-stone-50",
        ].join(" ")}
      >
        {placed.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              // tap a placed chip to send it back
              setPlaced((p) => p.filter((x) => x.id !== c.id));
              setBank((b) => [...b, c]);
              setStatus("idle");
            }}
            className="rounded-lg bg-white px-3 py-1.5 text-[14px] font-medium text-stone-700 shadow-sm ring-1 ring-black/5"
          >
            {c.text}
          </button>
        ))}
        {placed.length === 0 && (
          <span className="text-[13px] text-stone-400">Tap the words below…</span>
        )}
      </div>

      {/* word bank */}
      <div className="mb-4 flex flex-wrap gap-2">
        {bank.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => addChip(c)}
            className="rounded-xl bg-[#F4F4F4] px-4 py-2 text-[14px] font-medium text-stone-700 shadow-sm ring-1 ring-black/5 transition active:scale-95"
          >
            {c.text}
          </button>
        ))}
        {bank.length === 0 && (
          <span className="py-2 text-[13px] text-stone-400">All words used</span>
        )}
      </div>

      {/* actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={undo}
          disabled={!placed.length}
          className="flex-1 rounded-xl bg-stone-100 py-3 text-[14px] font-semibold text-stone-500 transition active:scale-[0.99] disabled:opacity-50"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={check}
          disabled={!placed.length}
          className="flex-1 rounded-xl bg-stone-800 py-3 text-[14px] font-semibold text-white transition active:scale-[0.99] disabled:opacity-40"
        >
          Check
        </button>
      </div>
    </motion.div>
  );
}
