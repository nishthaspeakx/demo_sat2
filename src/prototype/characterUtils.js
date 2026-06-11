/** Estimate how long a spoken line should keep the "speaking" state on. */
export function getSpeechDuration(text) {
  return Math.min(4500, Math.max(1200, String(text || "").length * 45));
}

/** Map a line of dialogue to an emotion. */
export function getEmotionForMessage(text = "") {
  if (/great|awesome|perfect|excellent/i.test(text)) return "excited";
  if (/aapko bolna|sahi|try again|phir se|didn’t catch|didn't catch|allow/i.test(text))
    return "encouraging";
  if (/welcome|hello/i.test(text)) return "happy";
  return "neutral";
}
