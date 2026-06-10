import React from "react";
import BottomPanel from "./BottomPanel.jsx";
import BottomPanelB from "./BottomPanelB.jsx";
import BottomPanelC from "./BottomPanelC.jsx";
import BottomPanelD from "./BottomPanelD.jsx";

const PANELS = { A: BottomPanel, B: BottomPanelB, C: BottomPanelC, D: BottomPanelD };

const TAJ_SRC = "/taj.jpg";
const SIA_SRC = "/sia.png";

function ProgressBar() {
  return (
    <div className="flex items-center gap-1.5 px-10 pt-3">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>
      <span className="h-1 flex-1 rounded-full bg-emerald-500" />
      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>
      <span className="h-1 flex-1 rounded-full bg-white/40" />
      <span className="h-5 w-5 rounded-full border-2 border-white/70 bg-white/30" />
    </div>
  );
}

function Bubble({ side = "left", children }) {
  const isLeft = side === "left";
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div
        className={[
          "max-w-[72%] rounded-2xl px-3.5 py-2.5 text-[14px] font-medium leading-snug text-stone-800 shadow-md",
          isLeft ? "bg-[#FFFDF7]" : "bg-[#FBEFD3]",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default function LessonScreen({ variant = "A", label, hintOpen = false }) {
  const Panel = PANELS[variant] || BottomPanel;
  return (
    <div className="relative flex aspect-[9/19.5] w-[390px] max-w-full flex-col overflow-hidden rounded-[2.5rem] bg-black text-white shadow-2xl ring-1 ring-white/10">
      {/* background */}
      <img
        src={TAJ_SRC}
        alt="Taj Mahal"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/30" />

      {/* foreground content */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <ProgressBar />

        {/* chat bubbles */}
        <div className="space-y-2.5 px-4 pt-4">
          <Bubble side="left">You need to handle the shop alone. But don't</Bubble>
          <Bubble side="left">A customer just walked in, greet them speak</Bubble>
          <Bubble side="right">Hello, Good morning!</Bubble>
        </div>

        {/* Sia anchored bottom-left, above the panel */}
        <div className="pointer-events-none relative mt-auto">
          <img
            src={SIA_SRC}
            alt="Sia"
            className="ml-1 h-[34svh] w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(120% 100% at 50% 42%, #000 78%, transparent 100%)",
              maskImage:
                "radial-gradient(120% 100% at 50% 42%, #000 78%, transparent 100%)",
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* bottom interaction panel — FIXED static height; identical in both states */}
      <div className="relative z-20 h-[260px] shrink-0">
        <Panel defaultHintOpen={hintOpen} />
      </div>

      {label && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
          {label}
        </div>
      )}
    </div>
  );
}
