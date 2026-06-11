import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTracker from "./ProgressTracker.jsx";
import ChatBubble from "./ChatBubble.jsx";
import BottomMicInput from "./BottomMicInput.jsx";
import MCQCard from "./MCQCard.jsx";
import AnagramCard from "./AnagramCard.jsx";
import ReadAlongCard from "./ReadAlongCard.jsx";
import AnimatedCharacter from "./AnimatedCharacter.jsx";

/**
 * TajChatScreen — fixed upper half (Taj gate + Sia + white fade + progress) and
 * a lower half whose content swaps based on `stage`. Presentational: all logic
 * lives in App; this renders state and forwards events.
 */
const MIC_STAGES = ["say_hello", "guide_sentence", "cost_sentence"];

export default function TajChatScreen({
  stage,
  completed,
  messages,
  listening,
  onMic,
  onMcqCorrect,
  onAnagramDone,
  onReadAlongDone,
  onMeetGuide,
  onUserText,
  siaState = "idle",
  siaEmotion = "neutral",
}) {
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, stage]);

  // Phase 1a: fade chat + CTA out, keep Sia/bg, then hand to the transition
  const [leaving, setLeaving] = useState(false);
  function startMeetGuide() {
    setLeaving(true);
    setTimeout(() => onMeetGuide && onMeetGuide(), 300);
  }

  return (
    <motion.div
      key="taj"
      initial={{ opacity: 0, scale: 1.12 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 overflow-hidden bg-white"
    >
      {/* ===== UPPER HALF — never changes ===== */}
      <img src="/assets/sia_2.png" alt="Taj Mahal"
        className="absolute inset-0 h-full w-full object-cover object-center" draggable={false} />
      <AnimatedCharacter
        type="sia"
        src="/assets/sia.png"
        state={siaState}
        emotion={siaEmotion}
        className="absolute left-1/2 top-[4%] z-10 h-[34%] -translate-x-1/2"
      />
      <div className="absolute inset-0 z-20" style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,0.6) 32%, rgba(255,255,255,0.95) 38%, #ffffff 44%)",
      }} />
      <div className={`absolute inset-x-0 top-0 z-40 pt-3 transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}>
        <ProgressTracker completed={completed} total={3} />
      </div>

      {/* ===== LOWER HALF (60%) — swaps by stage ===== */}
      <div className={`absolute inset-x-0 bottom-0 top-[40%] z-30 flex flex-col transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}>
        {/* chat list — MCQ & Anagram render inline as the latest chat item */}
        <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4 pt-2">
          {messages.map((m) => (
            <ChatBubble key={m.id} side={m.side} text={m.text} />
          ))}
          {stage === "mcq" && <MCQCard key="mcq" onCorrect={onMcqCorrect} />}
          {stage === "anagram" && <AnagramCard key="anagram" onDone={onAnagramDone} />}
        </div>

        {/* speaking input / read-along / final CTA stay pinned at the bottom */}
        <AnimatePresence mode="wait">
          {MIC_STAGES.includes(stage) && (
            <BottomMicInput key="mic" listening={listening} onMic={onMic} onSubmit={onUserText} />
          )}
          {stage === "read_along" && <ReadAlongCard key="read" onDone={onReadAlongDone} />}
          {stage === "final" && (
            <motion.div
              key="final"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="px-4 pb-6 pt-2"
            >
              <button
                type="button"
                onClick={startMeetGuide}
                className="w-full rounded-2xl py-4 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(242,121,43,0.45)] transition active:scale-[0.98]"
                style={{ background: "linear-gradient(145deg, #F7913F, #F2792B)" }}
              >
                Meet Guide
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
