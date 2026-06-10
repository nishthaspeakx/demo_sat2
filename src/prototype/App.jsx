import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
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
  const addMsg = (side, text) =>
    setMessages((m) => [...m, { id: nextId(), side, text }]);

  /* intro sequence when entering the chat screen */
  useEffect(() => {
    if (screen !== "chat") return;
    if (stage !== "intro") return; // skip when jumped via DEV_STAGE
    setMessages([{ id: nextId(), side: "sia", text: INTRO_1 }]);
    const t1 = setTimeout(() => addMsg("sia", INTRO_2), 900);
    const t2 = setTimeout(() => setStage("say_hello"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  /* mic press → simulate listening then the expected user speech */
  function handleMic() {
    if (listening) return;
    setListening(true);
    setTimeout(() => {
      setListening(false);
      if (stage === "say_hello") {
        addMsg("user", "Hello");
        setTimeout(() => {
          addMsg("sia", SIA_AFTER_HELLO);
          setStage("guide_sentence");
        }, 600);
      } else if (stage === "guide_sentence") {
        addMsg("user", "I looking for guide.");
        setTimeout(() => {
          addMsg("sia", SIA_WRONG_GUIDE);
          setStage("mcq");
        }, 600);
      } else if (stage === "cost_sentence") {
        addMsg("user", "What is the cost?");
        setTimeout(() => setStage("anagram"), 600);
      }
    }, 1000);
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
