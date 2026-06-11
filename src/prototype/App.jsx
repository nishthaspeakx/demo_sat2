import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { speak, stopSpeaking, recognizeOnce, recognitionSupported, matches } from "./speech.js";
import MapScreen from "./MapScreen.jsx";
import TajChatScreen from "./TajChatScreen.jsx";
import MeetGuideTransition from "./MeetGuideTransition.jsx";
import GuideConversationScreen from "./GuideConversationScreen.jsx";
import ResultSiaScreen from "./ResultSiaScreen.jsx";

/* dialogue copy (curly quotes per spec) */
const INTRO_1 =
  "Welcome to Taj Mahal! Aapko yahan guide karna hoga. Let’s learn guide se English mein kese baat karte hai.";
const INTRO_2 = "Sabse pehle let’s greet the guide. Say “Hello!”";
const SIA_AFTER_HELLO = "Great! fir aap guide se bolo “I am looking for guide.”";
const SIA_WRONG_GUIDE =
  "Aapko bolna hai “I am looking for guide.” sahi uttar chuno";
const SIA_AFTER_MCQ = "Great! Now ask “What will be the cost?”";
const SIA_AFTER_ANAGRAM =
  "Awesome! now aapko guide ko kehna hai “Ok, I will hire you.” Repeat after me.";
const SIA_FINAL =
  "Great ab aap ready hai guide hire karne ke liye. Let’s meet the guide and talk to him.";
const SIA_TRY_HELLO = "Almost! Bas “Hello” boliye.";
const SIA_WRONG_COST = "Aapko bolna hai “What will be the cost?” — let’s arrange it.";

/**
 * App — prototype root + state machine.
 * stage: intro | say_hello | guide_sentence | mcq | cost_sentence | anagram
 *        | read_along | final
 * completedTasks: 0 | 1 | 2 | 3
 */
// dev-only shortcut: /?stage=final jumps straight to a stage for testing
const DEV_STAGE =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("stage")
    : null;

export default function App() {
  const [screen, setScreen] = useState(DEV_STAGE ? "chat" : "map"); // map | chat
  const [stage, setStage] = useState(DEV_STAGE || "intro");
  const [completed, setCompleted] = useState(DEV_STAGE === "final" ? 3 : 0);
  const [messages, setMessages] = useState(
    DEV_STAGE === "final" ? [{ id: -1, side: "sia", text: SIA_FINAL }] : []
  );
  const [listening, setListening] = useState(false);

  const idRef = useRef(0);
  const nextId = () => ++idRef.current;
  // adding a Sia line also speaks it aloud (TTS)
  const addMsg = (side, text, opts = {}) => {
    setMessages((m) => [...m, { id: nextId(), side, text }]);
    if (side === "sia") speak(text, { gender: "female", onend: opts.onend, queue: opts.queue });
    else if (opts.onend) opts.onend();
  };
  // current stage in a ref so async recognition callbacks read the latest value
  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  /* intro sequence when entering the chat screen */
  useEffect(() => {
    if (screen !== "chat") return;
    if (stage !== "intro") return; // skip when jumped via DEV_STAGE
    // chat-paced bubbles; speech queues so both lines are still spoken in order
    setMessages([{ id: nextId(), side: "sia", text: INTRO_1 }]);
    speak(INTRO_1, { gender: "female" });
    const t1 = setTimeout(() => addMsg("sia", INTRO_2, { queue: true }), 1100);
    const t2 = setTimeout(() => setStage("say_hello"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function siaThen(text, nextStage, delay = 450) {
    setTimeout(() => {
      addMsg("sia", text);
      setStage(nextStage);
    }, delay);
  }

  /* evaluate a real spoken/typed answer for the current speaking stage */
  function handleAnswer(text) {
    const s = stageRef.current;
    addMsg("user", text);
    if (s === "say_hello") {
      if (matches(text, "hello")) siaThen(SIA_AFTER_HELLO, "guide_sentence");
      else siaThen(SIA_TRY_HELLO, "say_hello");
    } else if (s === "guide_sentence") {
      if (matches(text, "I am looking for guide")) {
        setCompleted((c) => Math.max(c, 1));
        siaThen(SIA_AFTER_MCQ, "cost_sentence");
      } else {
        siaThen(SIA_WRONG_GUIDE, "mcq"); // wrong → MCQ helps
      }
    } else if (s === "cost_sentence") {
      if (matches(text, "What will be the cost")) {
        setCompleted((c) => Math.max(c, 2));
        siaThen(SIA_AFTER_ANAGRAM, "read_along");
      } else {
        siaThen(SIA_WRONG_COST, "anagram"); // wrong → Anagram helps
      }
    }
  }

  /* mic press → REAL speech recognition (no auto-answer) */
  function handleMic() {
    if (listening) return;
    if (!recognitionSupported()) {
      // no STT here → nudge the learner to type instead
      addMsg("sia", "Mic isn’t available here — type your answer below.");
      return;
    }
    stopSpeaking();
    setListening(true);
    recognizeOnce({
      onResult: (t) => handleAnswer(t),
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
  }

  function handleMcqCorrect(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 1));
    setTimeout(() => {
      addMsg("sia", SIA_AFTER_MCQ);
      setStage("cost_sentence");
    }, 600);
  }

  function handleAnagramDone(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 2));
    setTimeout(() => {
      addMsg("sia", SIA_AFTER_ANAGRAM);
      setStage("read_along");
    }, 600);
  }

  function handleReadAlongDone(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 3));
    setTimeout(() => {
      addMsg("sia", SIA_FINAL);
      setStage("final");
    }, 400);
  }

  function handleMeetGuide() {
    setStage("transition_to_guide");
  }

  // which top-level view to render
  const view =
    screen === "map"
      ? "map"
      : stage === "transition_to_guide"
      ? "transition"
      : stage === "guide"
      ? "guide"
      : stage === "result_sia"
      ? "result"
      : "chat";

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-neutral-900">
      <div className="relative h-[100dvh] max-h-[844px] w-full max-w-[390px] overflow-hidden bg-black shadow-2xl sm:rounded-[2.2rem]">
        <AnimatePresence mode="sync">
          {view === "map" && (
            <MapScreen key="map" onStart={() => setScreen("chat")} />
          )}
          {view === "chat" && (
            <TajChatScreen
              key="taj"
              stage={stage}
              completed={completed}
              messages={messages}
              listening={listening}
              onMic={handleMic}
              onUserText={handleAnswer}
              onMcqCorrect={handleMcqCorrect}
              onAnagramDone={handleAnagramDone}
              onReadAlongDone={handleReadAlongDone}
              onMeetGuide={handleMeetGuide}
            />
          )}
          {view === "transition" && (
            <MeetGuideTransition
              key="transition"
              onComplete={() => setStage("guide")}
              fallbackMs={4000}
            />
          )}
          {view === "guide" && (
            <GuideConversationScreen
              key="guide"
              onComplete={() => setStage("result_sia")}
            />
          )}
          {view === "result" && (
            <ResultSiaScreen key="result" onGoToCafe={() => {}} />
          )}
        </AnimatePresence>

        {/* preload the transition clip so Meet Guide plays instantly */}
        <video
          src="/assets/guide-transition.mp4"
          preload="auto"
          muted
          playsInline
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
