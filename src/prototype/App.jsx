import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { speak, stopSpeaking, recognizeOnce, recognitionSupported, matches } from "./speech.js";
import { clipKeyForText } from "./lipsync.js";

const estMs = (t) => Math.min(6000, Math.max(1500, String(t || "").length * 55));
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
  const [typing, setTyping] = useState(false);
  const [siaClip, setSiaClip] = useState(null); // { key, onEnd } while a lip-sync clip plays

  const idRef = useRef(0);
  const nextId = () => ++idRef.current;
  const clipRef = useRef(null);
  useEffect(() => { clipRef.current = siaClip; }, [siaClip]);

  // Sia line: if a pre-generated lip-sync clip exists, play it (its own audio);
  // otherwise fall back to browser TTS. opts.onClipEnd fires when she finishes the line.
  const addMsg = (side, text, opts = {}) => {
    setMessages((m) => [...m, { id: nextId(), side, text }]);
    if (side !== "sia") {
      if (opts.onend) opts.onend();
      return;
    }
    const key = clipKeyForText(text);
    if (key) {
      stopSpeaking();
      setSiaClip({ key, onEnd: opts.onClipEnd });
    } else {
      speak(text, { gender: "female", onend: opts.onend, queue: opts.queue });
      if (opts.onClipEnd) setTimeout(opts.onClipEnd, estMs(text));
    }
  };

  // called when a lip-sync video finishes (from TajChatScreen / ResultSiaScreen)
  function handleSiaClipEnd() {
    const cb = clipRef.current?.onEnd;
    setSiaClip(null);
    if (cb) cb();
  }
  // current stage in a ref so async recognition callbacks read the latest value
  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  /* intro sequence when entering the chat screen */
  useEffect(() => {
    if (screen !== "chat") return;
    if (stage !== "intro") return; // skip when jumped via DEV_STAGE
    // play intro line 1, then line 2, then open the speaking stage — chained to
    // each clip ending so the spoken audio isn't cut off
    setMessages([]);
    addMsg("sia", INTRO_1, {
      onClipEnd: () =>
        addMsg("sia", INTRO_2, { onClipEnd: () => setStage("say_hello") }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function siaThen(text, nextStage, delay = 700) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
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
    const startedAt = Date.now();
    // keep the "Listening…" cue visible for at least 600ms even if STT errors fast
    const stop = () =>
      setTimeout(() => setListening(false), Math.max(0, 600 - (Date.now() - startedAt)));
    recognizeOnce({
      onResult: (t) => handleAnswer(t),
      onError: (e) => {
        if (e === "not-allowed" || e === "service-not-allowed")
          addMsg("sia", "Please allow microphone access — ya niche type karein.");
        else if (e === "no-speech")
          addMsg("sia", "Mujhe sunai nahi diya — phir se boliye.");
        stop();
      },
      onEnd: stop,
    });
  }

  function handleMcqCorrect(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 1));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg("sia", SIA_AFTER_MCQ);
      setStage("cost_sentence");
    }, 700);
  }

  function handleAnagramDone(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 2));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg("sia", SIA_AFTER_ANAGRAM);
      setStage("read_along");
    }, 700);
  }

  function handleReadAlongDone(text) {
    addMsg("user", text);
    setCompleted((c) => Math.max(c, 3));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg("sia", SIA_FINAL);
      setStage("final");
    }, 600);
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
              typing={typing}
              siaClip={siaClip}
              onSiaClipEnd={handleSiaClipEnd}
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
