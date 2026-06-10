import React from "react";
import { motion } from "framer-motion";

/**
 * ChatBubble — animated message bubble.
 * Sia: left, off-white #fffaf5. User: right, pale yellow #ffefc7. Radius 18px.
 */
export default function ChatBubble({ text, side = "sia" }) {
  const isUser = side === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[82%] px-4 py-2.5 text-[14px] leading-snug text-stone-800 shadow-sm"
        style={{
          background: isUser ? "#ffefc7" : "#fffaf5",
          borderRadius: 18,
          borderBottomRightRadius: isUser ? 6 : 18,
          borderBottomLeftRadius: isUser ? 18 : 6,
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}
