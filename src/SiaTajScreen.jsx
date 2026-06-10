import React from "react";

/**
 * SiaTajScreen
 * -------------------------------------------------------------------------
 * A 9:16 mobile screen for an English-learning game.
 *
 * Visual layer stack (bottom -> top):
 *   1. Full-screen Taj Mahal background (object-cover, centered)
 *   2. Bottom-half copy of the SAME background, blurred + faded + darkened,
 *      clipped to the lower 50% only
 *   3. A smooth vertical gradient that hides the seam between the two halves
 *      and improves text contrast at the bottom
 *   4. Sia — a transparent cutout PNG, upper-left, with a soft glow behind her
 *   5. The chat UI, living entirely inside the lower (blurred) half
 *
 * Assets expected in /public:
 *   - /taj.jpg  -> the Taj Mahal gate background
 *   - /sia.png  -> Sia, with the dark background removed (transparent PNG)
 *
 * The component scales to its parent. On desktop it renders inside a phone
 * frame; on a real device it can fill the viewport (use `fullscreen`).
 */

const TAJ_SRC = "/taj.jpg";
const SIA_SRC = "/sia.png";

/* ---------------------------------- chat data --------------------------- */

const MESSAGES = [
  { from: "sia", text: "Welcome to the Taj Mahal! Ready to practise English?" },
  { from: "user", text: "Yes, I am ready." },
  { from: "sia", text: "Great! Tell me what you can see here." },
  { from: "user", text: "I can see a beautiful gate and the Taj Mahal." },
  { from: "sia", text: "Perfect! Let's continue." },
];

/* ------------------------------- sub components -------------------------- */

function ChatBubble({ from, text }) {
  const isUser = from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[78%] px-3.5 py-2 text-[13px] leading-snug shadow-sm",
          isUser
            ? "rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
            : "rounded-2xl rounded-bl-md bg-[#fffaf2] text-stone-800 ring-1 ring-black/5",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}

function SiaAvatar() {
  return (
    <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/80 ring-2 ring-white/70 shadow">
      <img
        src={SIA_SRC}
        alt="Sia"
        className="h-full w-full scale-[1.6] object-cover object-top"
      />
    </div>
  );
}

function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

/* --------------------------------- screen ------------------------------- */

export default function SiaTajScreen({ fullscreen = false }) {
  return (
    <div
      className={[
        "relative overflow-hidden bg-black text-white select-none",
        fullscreen
          ? "h-[100dvh] w-screen"
          : "aspect-[9/19.5] w-[390px] max-w-full rounded-[2.5rem] shadow-2xl ring-1 ring-white/10",
      ].join(" ")}
    >
      {/* 1 — full-screen background */}
      <img
        src={TAJ_SRC}
        alt="Taj Mahal gate"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />

      {/* 2 — bottom half: same image, blurred + faded + darkened, clipped to lower 50% */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 overflow-hidden">
        <img
          src={TAJ_SRC}
          alt=""
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[200%] w-full object-cover object-center blur-lg scale-110 brightness-[0.7]"
          draggable={false}
        />
        {/* darkening veil for chat readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 3 — seam gradient: clear at top, gently darkening downward (no hard cut) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(10,8,14,0.25) 50%, rgba(10,8,14,0.55) 62%, rgba(10,8,14,0.78) 100%)",
        }}
      />

      {/* 4 — Sia: upper-left transparent cutout with soft glow behind */}
      <div className="pointer-events-none absolute left-0 top-[4%] z-10">
        <div className="relative">
          {/* soft warm glow so she blends with the scene */}
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,225,190,0.45), rgba(255,210,170,0.15) 60%, transparent 75%)",
            }}
          />
          <img
            src={SIA_SRC}
            alt="Sia, your English guide"
            className="h-[36svh] w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]"
            style={{
              // feather any imperfect cutout edges so she melts into the scene
              WebkitMaskImage:
                "radial-gradient(120% 100% at 50% 42%, #000 78%, transparent 100%)",
              maskImage:
                "radial-gradient(120% 100% at 50% 42%, #000 78%, transparent 100%)",
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* 5 — chat UI, confined to the lower blurred half */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 z-20 flex flex-col px-3 pb-4 pt-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
          {/* header */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <SiaAvatar />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Sia</div>
              <div className="text-[11px] text-white/70">Your English guide</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-300/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          {/* messages */}
          <div
            className="flex-1 space-y-2 overflow-y-auto px-3.5 py-2.5"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, #000 14px)",
              maskImage: "linear-gradient(to bottom, transparent 0, #000 14px)",
            }}
          >
            {MESSAGES.map((m, i) => (
              <ChatBubble key={i} from={m.from} text={m.text} />
            ))}
          </div>

          {/* input bar */}
          <div className="border-t border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/15">
              <input
                type="text"
                placeholder="Type your answer…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/55 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Speak or send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md transition active:scale-95"
              >
                <MicIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
