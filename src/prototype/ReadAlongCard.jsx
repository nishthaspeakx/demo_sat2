import React, { useState } from "react";
import { motion } from "framer-motion";
import { MicIcon, SpeakerIcon, TrashIcon, Waveform, BRAND_ORANGE } from "./icons.jsx";
import { speak, recognizeOnce, recognitionSupported } from "./speech.js";

/**
 * ReadAlongCard — "Speak this sentence". The learner must actually speak (real
 * recognition). Speaker button plays the sentence. Skip bypasses. The sentence
 * is configurable.
 */
export default function ReadAlongCard({ onDone, sentence = "Ok, I will hire you.", voice = "female" }) {
  const SENTENCE = sentence;
  const WORDS = SENTENCE.split(" ");
  const [state, setState] = useState("idle"); // idle | listening

  function startListening() {
    if (state === "listening") return;
    if (!recognitionSupported()) {
      // no STT (e.g. http on phone) → accept the attempt after a beat
      setState("listening");
      setTimeout(() => onDone(SENTENCE), 1200);
      return;
    }
    setState("listening");
    recognizeOnce({
      onResult: () => onDone(SENTENCE), // repeat-after-me → accept the attempt
      onError: () => setState("idle"),
      onEnd: (got) => {
        if (!got) setState("idle");
      },
    });
  }

  const listening = state === "listening";

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-3 mb-4 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5"
    >
      {/* pill */}
      <div className="mb-3 flex justify-center">
        <span className="rounded-full bg-[#FFF1DF] px-4 py-1.5 text-[12px] font-semibold text-orange-500">
          {listening ? "Listening…" : "Speak this sentence"}
        </span>
      </div>

      {/* sentence (first word highlighted while listening) */}
      <p className="mb-4 text-center text-[18px] font-bold text-stone-800">
        {WORDS.map((w, i) => (
          <span key={i} className={listening && i === 0 ? "text-orange-500" : ""}>
            {w}{i < WORDS.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      {/* controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => !listening && speak(SENTENCE, { gender: voice })}
          aria-label={listening ? "Delete" : "Listen"}
          className="grid h-11 w-11 place-items-center rounded-full bg-stone-100 text-stone-500 shadow-sm transition active:scale-95"
        >
          {listening ? <TrashIcon className="h-5 w-5 text-red-400" /> : <SpeakerIcon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={startListening}
          aria-label="Speak"
          className="relative grid h-16 w-16 place-items-center rounded-full text-white transition active:scale-95"
          style={{
            background: `linear-gradient(145deg, #F7913F, ${BRAND_ORANGE})`,
            boxShadow: "0 0 26px 7px rgba(242,121,43,0.45), 0 6px 16px rgba(242,121,43,0.35)",
          }}
        >
          {listening ? <Waveform color="#fff" /> : <MicIcon className="h-7 w-7" />}
        </button>

        <button
          type="button"
          onClick={() => onDone(SENTENCE)}
          className="rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-stone-600 shadow-sm ring-1 ring-black/5 transition active:scale-95"
        >
          Skip
        </button>
      </div>
    </motion.div>
  );
}
