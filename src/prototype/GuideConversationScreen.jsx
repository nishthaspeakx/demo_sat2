import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTracker from "./ProgressTracker.jsx";
import ChatBubble from "./ChatBubble.jsx";
import MCQCard from "./MCQCard.jsx";
import AnagramCard from "./AnagramCard.jsx";
import ReadAlongCard from "./ReadAlongCard.jsx";
import BottomMicInput from "./BottomMicInput.jsx";
import { speak, stopSpeaking, recognizeOnce, recognitionSupported, matches } from "./speech.js";

/**
 * GuideConversationScreen — fixed top half (guide-bg + guide character + white
 * fade + progress, all 3 circles grey to start) and a lower half that runs its
 * own guide flow. Self-contained; calls onComplete() to advance to the result.
 *
 * stages: guide_intro → guide_hello → guide_anagram → guide_mcq
 *         → guide_read_along → guide_complete
 */
export default function GuideConversationScreen({ onComplete }) {
  const [stage, setStage] = useState("guide_intro");
  const [completed, setCompleted] = useState(0); // guideTasksCompleted
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const idRef = useRef(0);
  const nextId = () => ++idRef.current;
  const add = (side, text, opts = {}) => {
    setMessages((m) => [...m, { id: nextId(), side, text }]);
    if (side === "guide") speak(text, { gender: "male", onend: opts.onend });
    else if (opts.onend) opts.onend();
  };

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, stage]);

  /* intro: guide greets, then the USER must greet back (real mic / type) */
  useEffect(() => {
    setMessages([{ id: nextId(), side: "guide", text: "Hello" }]);
    speak("Hello", { gender: "male", onend: () => setStage("guide_hello") });
    const safety = setTimeout(
      () => setStage((s) => (s === "guide_intro" ? "guide_hello" : s)),
      4000
    );
    return () => clearTimeout(safety);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* user greets the guide */
  function handleHello(text) {
    add("user", text);
    if (matches(text, "hello") || matches(text, "hi")) {
      add("guide", "How may I help you?", {
        onend: () => setStage("guide_anagram"),
      });
    } else {
      add("guide", "Greet me first — just say “Hello”.");
    }
  }

  function handleMic() {
    if (listening) return;
    if (!recognitionSupported()) {
      add("guide", "Mic isn’t available here — type your answer below.");
      return;
    }
    stopSpeaking();
    setListening(true);
    recognizeOnce({
      onResult: (t) => handleHello(t),
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
  }

  function handleAnagram(text) {
    add("user", text);
    setCompleted((c) => Math.max(c, 1));
    setTimeout(() => add("guide", "Sure, I am available."), 600);
    setTimeout(() => add("guide", "What would you like to ask next?"), 1500);
    setTimeout(() => setStage("guide_mcq"), 2300);
  }

  function handleMcq(text) {
    add("user", text);
    setCompleted((c) => Math.max(c, 2));
    setTimeout(() => add("guide", "It’s 500 Rs per hour."), 600);
    setTimeout(() => setStage("guide_read_along"), 1500);
  }

  function handleReadAlong(text) {
    add("user", text); // sentence drops in as a normal chat bubble
    setCompleted((c) => Math.max(c, 3)); // tick task 3 (animates in tracker)
    setTimeout(() => add("guide", "Awesome! Let’s visit Taj Mahal."), 400);
    setTimeout(() => setStage("guide_complete"), 1300);
  }

  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute inset-0 overflow-hidden bg-white"
    >
      {/* ===== TOP HALF — fixed ===== */}
      <img src="/assets/guide_2.png" alt="Taj Mahal"
        className="absolute inset-0 h-full w-full object-cover object-center" draggable={false} />

      <img
        src="/assets/guide-character.svg"
        alt="Guide"
        className="guide-enter absolute left-1/2 top-[3%] z-10 h-[36%] w-auto object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
        draggable={false}
      />

      <div className="absolute inset-0 z-20" style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,0.6) 32%, rgba(255,255,255,0.95) 38%, #ffffff 44%)",
      }} />

      <div className="absolute inset-x-0 top-0 z-40 pt-3">
        <ProgressTracker completed={completed} total={3} />
      </div>

      {/* ===== LOWER HALF (60%) — guide flow ===== */}
      <div className="absolute inset-x-0 bottom-0 top-[40%] z-30 flex flex-col">
        <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4 pt-2">
          {messages.map((m) => (
            <ChatBubble key={m.id} side={m.side} text={m.text} />
          ))}

          {stage === "guide_anagram" && (
            <AnagramCard
              key="g-anagram"
              answer={["I", "am", "looking", "for", "guide"]}
              scrambled={["looking", "I", "guide", "for", "am"]}
              sentence="I am looking for guide."
              onDone={handleAnagram}
            />
          )}
          {stage === "guide_mcq" && (
            <MCQCard
              key="g-mcq"
              heading="What will you ask about the cost?"
              options={["What is the cost?", "What are cost?", "How cost?"]}
              correctIndex={0}
              onCorrect={handleMcq}
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {stage === "guide_hello" && (
            <BottomMicInput key="g-hello" listening={listening} onMic={handleMic} onSubmit={handleHello} />
          )}
          {stage === "guide_read_along" && (
            <ReadAlongCard key="g-read" sentence="Great! I will hire you." voice="male" onDone={handleReadAlong} />
          )}
          {stage === "guide_complete" && (
            <motion.div
              key="g-cta"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="px-4 pb-6 pt-2"
            >
              <button
                type="button"
                onClick={onComplete}
                className="w-full rounded-2xl py-4 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(242,121,43,0.45)] transition active:scale-[0.98]"
                style={{ background: "linear-gradient(145deg, #F7913F, #F2792B)" }}
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
