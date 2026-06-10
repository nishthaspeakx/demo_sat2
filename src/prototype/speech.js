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

function pickVoice(gender) {
  const list = (window.speechSynthesis?.getVoices?.() || voices) || [];
  if (!list.length) return null;
  const indian = list.find((v) => /en[-_]IN/i.test(v.lang));
  if (indian) return indian;
  const femaleRe = /female|samantha|zira|aria|jenny|google us english|google uk english female/i;
  const maleRe = /male|daniel|david|alex|google uk english male/i;
  const byGender = list.find((v) =>
    /^en/i.test(v.lang) && (gender === "male" ? maleRe : femaleRe).test(v.name)
  );
  return byGender || list.find((v) => /^en/i.test(v.lang)) || list[0];
}

/** Speak `text`. gender: "female" (Sia) | "male" (guide). */
export function speak(text, { gender = "female", rate = 1 } = {}) {
  try {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;
    const u = new SpeechSynthesisUtterance(
      String(text).replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    );
    const v = pickVoice(gender);
    if (v) u.voice = v;
    u.lang = (v && v.lang) || "en-IN";
    u.rate = rate;
    u.pitch = gender === "male" ? 0.9 : 1.08;
    synth.speak(u); // utterances queue naturally
  } catch {
    /* no-op */
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
