import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTracker from "./ProgressTracker.jsx";
import ChatBubble from "./ChatBubble.jsx";
import BottomMicInput from "./BottomMicInput.jsx";
import MCQCard from "./MCQCard.jsx";
import AnagramCard from "./AnagramCard.jsx";
import ReadAlongCard from "./ReadAlongCard.jsx";
import Suggestion from "./Suggestion.jsx";

/**
 * TajChatScreen — fixed upper half (Taj gate + Sia + white fade + progress) and
 * a lower half whose content swaps based on `stage`. Presentational: all logic
 * lives in App; this renders state and forwards events.
 */
const MIC_STAGES = ["say_hello", "guide_sentence", "cost_sentence"];

// stage-appropriate hint shown on "Show hint"
const HINTS = {
  say_hello: { en: "Hello!", hi: "नमस्ते! / हैलो!" },
  guide_sentence: { en: "I am looking for guide.", hi: "मैं एक गाइड ढूँढ रहा हूँ।" },
  cost_sentence: { en: "What will be the cost?", hi: "इसकी कीमत क्या होगी?" },
};

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#fffaf5] px-4 py-3 shadow-sm">
        {[0, 0.15, 0.3].map((d, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-stone-400"
            style={{ animation: `typingDot 1s ${d}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

export default function TajChatScreen({
  stage,
  completed,
  messages,
  listening,
  typing,
  onMic,
  onMcqCorrect,
  onAnagramDone,
  onReadAlongDone,
  onMeetGuide,
  onUserText,
  siaClip,
  onSiaClipEnd,
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const hint = HINTS[stage];
  useEffect(() => setHintOpen(false), [stage]); // reset hint when stage changes
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
      {/* ===== UPPER HALF — Sia stage; talking video while a clip plays ===== */}
      <img src="/assets/sia-stage.png" alt="Sia at the Taj Mahal"
        className="absolute inset-x-0 top-0 z-0 w-full h-auto" draggable={false} />
      {siaClip && (
        <video
          key={siaClip.key}
          src={`/assets/lipsync/${siaClip.key}.mp4`}
          autoPlay
          playsInline
          onEnded={onSiaClipEnd}
          onError={onSiaClipEnd}
          className="absolute inset-x-0 top-0 z-10 w-full h-auto"
        />
      )}
      <div className="absolute inset-0 z-20" style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.95) 48%, #ffffff 52%)",
      }} />
      <div className={`absolute inset-x-0 top-[5%] z-40 transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}>
        <ProgressTracker completed={completed} total={3} />
      </div>

      {/* ===== LOWER HALF (60%) — swaps by stage ===== */}
      <div className={`absolute inset-x-0 bottom-0 top-[50%] z-30 flex flex-col transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}>
        {/* chat list — MCQ & Anagram render inline as the latest chat item */}
        <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4 pt-2">
          {messages.map((m) => (
            <ChatBubble key={m.id} side={m.side} text={m.text} />
          ))}
          {stage === "mcq" && <MCQCard key="mcq" onCorrect={onMcqCorrect} />}
          {stage === "anagram" && <AnagramCard key="anagram" onDone={onAnagramDone} />}
          {typing && <TypingDots key="typing" />}

          {/* show-hint sits in the chat flow, right under the bubbles */}
          {MIC_STAGES.includes(stage) && hint && (
            hintOpen ? (
              <Suggestion
                english={hint.en}
                translation={hint.hi}
                onHide={() => setHintOpen(false)}
                onUse={() => setHintOpen(false)}
              />
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setHintOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white/80 px-4 py-2.5 text-[14px] font-medium text-stone-500 shadow-sm transition active:scale-[0.98]"
                >
                  <span className="text-lg leading-none">💡</span> Show hint
                </button>
              </div>
            )
          )}
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
