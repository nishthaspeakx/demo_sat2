/**
 * Tiny wrapper around the Web Speech API.
 * - speak(text): text-to-speech for Sia / the guide.
 * - recognizeOnce(): one-shot speech-to-text from the mic.
 * - matches(): lenient comparison of a spoken answer to the expected sentence.
 *
 * Notes:
 * - STT (SpeechRecognition) is Chrome/Edge + needs a secure context
 *   (localhost counts; plain http over LAN does NOT). A typed fallback is
 *   provided in the UI for unsupported cases.
 * - TTS works in Chrome/Safari/Edge.
 */

let voices = [];
function refreshVoices() {
  try {
    voices = window.speechSynthesis?.getVoices?.() || [];
  } catch {
    voices = [];
  }
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

const FEMALE_NAMES = /samantha|victoria|allison|ava|susan|karen|moira|tessa|fiona|veena|kate|serena|zoe|nicky|joana|female|zira|aria|jenny|libby|sonia|neerja|heera|isha/i;
const MALE_NAMES = /daniel|alex|fred|tom|aaron|rishi|oliver|lee|gordon|male|david|mark|guy|ravi|prabhat|hemant|madhur/i;

function pickVoice(gender) {
  const list = (window.speechSynthesis?.getVoices?.() || voices) || [];
  if (!list.length) return null;
  const en = list.filter((v) => /^en/i.test(v.lang));
  const pool = en.length ? en : list;
  const enIN = pool.filter((v) => /en[-_]IN/i.test(v.lang));
  const want = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
  const avoid = gender === "male" ? FEMALE_NAMES : MALE_NAMES;
  return (
    enIN.find((v) => want.test(v.name)) || // gender + Indian English
    pool.find((v) => want.test(v.name)) || // gender, any English
    enIN.find((v) => !avoid.test(v.name)) || // Indian, not wrong gender
    pool.find((v) => !avoid.test(v.name)) ||
    pool[0]
  );
}

function estMs(text) {
  const words = String(text).trim().split(/\s+/).length;
  return Math.min(7000, Math.max(800, words * 340));
}

/**
 * Speak `text`. gender: "female" (Sia) | "male" (guide).
 * Cancels any current speech first so the audio matches the newest bubble.
 * `onend` fires when speech finishes (or after a fallback if TTS is missing) —
 * use it to keep the conversation in sync with the voice.
 */
export function speak(text, { gender = "female", rate = 1, onend } = {}) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (!synth || !text) {
    if (onend) setTimeout(onend, estMs(text));
    return;
  }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(
      String(text).replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    );
    const v = pickVoice(gender);
    if (v) u.voice = v;
    u.lang = (v && v.lang) || "en-IN";
    u.rate = rate;
    u.pitch = gender === "male" ? 0.85 : 1.1;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onend && onend();
    };
    u.onend = finish;
    u.onerror = finish;
    setTimeout(finish, estMs(text) + 1500); // safety if onend never fires
    synth.speak(u);
  } catch {
    if (onend) setTimeout(onend, estMs(text));
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* no-op */
  }
}

export function recognitionSupported() {
  return (
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

/** One-shot recognition. Returns the recognition instance (or null). */
export function recognizeOnce({ onResult, onError, onEnd } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onError && onError("unsupported");
    return null;
  }
  stopSpeaking();
  const rec = new SR();
  rec.lang = "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.continuous = false;
  let got = false;
  rec.onresult = (e) => {
    got = true;
    const transcript = e.results[0][0].transcript;
    onResult && onResult(transcript);
  };
  rec.onerror = (e) => onError && onError(e.error || "error");
  rec.onend = () => onEnd && onEnd(got);
  try {
    rec.start();
  } catch {
    onError && onError("start-failed");
  }
  return rec;
}

export function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lenient match: exact, containment, or ≥70% word overlap. */
export function matches(transcript, expected) {
  const t = normalize(transcript);
  const e = normalize(expected);
  if (!t || !e) return false;
  if (t === e || t.includes(e) || e.includes(t)) return true;
  const ew = e.split(" ");
  const tw = new Set(t.split(" "));
  const hit = ew.filter((w) => tw.has(w)).length;
  return hit / ew.length >= 0.7;
}
