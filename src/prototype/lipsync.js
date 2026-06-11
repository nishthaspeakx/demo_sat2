// Maps each Sia line to its pre-generated lip-sync clip (public/assets/lipsync/<key>.mp4).
// Texts must match the message text added in the app exactly (after normalize()).
export const SIA_CLIP_TEXT = {
  intro1: "Welcome to Taj Mahal! Aapko yahan guide karna hoga. Let’s learn guide se English mein kese baat karte hai.",
  intro2: "Sabse pehle let’s greet the guide. Say “Hello!”",
  after_hello: "Great! fir aap guide se bolo “I am looking for guide.”",
  wrong_guide: "Aapko bolna hai “I am looking for guide.” sahi uttar chuno",
  after_mcq: "Great! Now ask “What will be the cost?”",
  after_anagram: "Awesome! now aapko guide ko kehna hai “Ok, I will hire you.” Repeat after me.",
  final: "Great ab aap ready hai guide hire karne ke liye. Let’s meet the guide and talk to him.",
  try_hello: "Almost! Bas “Hello” boliye.",
  wrong_cost: "Aapko bolna hai “What will be the cost?” — let’s arrange it.",
  result: "Great! You spoke with guide well. Taj Mahal ghumke I think you will be hungry. So let’s go to cafe after that.",
};

const norm = (s) =>
  (s || "").toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

const BY_TEXT = Object.fromEntries(
  Object.entries(SIA_CLIP_TEXT).map(([k, t]) => [norm(t), k])
);

export function clipKeyForText(text) {
  return BY_TEXT[norm(text)] || null;
}

export const clipUrl = (key) => `/assets/lipsync/${key}.mp4`;
