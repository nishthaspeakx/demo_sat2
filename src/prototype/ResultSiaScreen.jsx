import React from "react";
import { motion } from "framer-motion";
import ChatBubble from "./ChatBubble.jsx";

/**
 * ResultSiaScreen — Taj + Sia style screen shown after the guide conversation.
 * Sia centered, white fade, one Sia message, and a "Go to Cafe" CTA.
 */
export default function ResultSiaScreen({ onGoToCafe }) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 overflow-hidden bg-white"
    >
      <img src="/assets/sia_3.png" alt="Taj Mahal"
        className="absolute inset-x-0 top-0 w-full h-auto" draggable={false} />
      <img src="/assets/sia.png" alt="Sia"
        className="absolute left-1/2 top-[8%] z-10 h-[46%] w-auto -translate-x-1/2 object-contain"
        draggable={false} />
      <div className="absolute inset-0 z-20" style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.6) 44%, rgba(255,255,255,0.95) 52%, #ffffff 58%)",
      }} />

      <div className="absolute inset-x-0 bottom-0 top-[52%] z-30 flex flex-col">
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pt-2">
          <ChatBubble
            side="sia"
            text="Great! You spoke with guide well. Taj Mahal ghumke I think you will be hungry. So let’s go to cafe after that."
          />
        </div>
        <div className="px-4 pb-6 pt-2">
          <button
            type="button"
            onClick={onGoToCafe}
            className="w-full rounded-2xl py-4 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(242,121,43,0.45)] transition active:scale-[0.98]"
            style={{ background: "linear-gradient(145deg, #F7913F, #F2792B)" }}
          >
            Go to Cafe
          </button>
        </div>
      </div>
    </motion.div>
  );
}
