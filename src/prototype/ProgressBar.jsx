import React from "react";

/**
 * ProgressBar — 3 steps, first two complete (green check), third pending.
 */
function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

export default function ProgressBar({ done = 2, total = 3 }) {
  return (
    <div className="flex items-center px-12">
      {Array.from({ length: total }).map((_, i) => {
        const completed = i < done;
        const isLast = i === total - 1;
        return (
          <React.Fragment key={i}>
            <span
              className={[
                "grid h-6 w-6 shrink-0 place-items-center rounded-full ring-2 ring-white/70",
                completed ? "bg-emerald-500" : "bg-white/40",
              ].join(" ")}
            >
              {completed && <Check />}
            </span>
            {!isLast && (
              <span
                className={[
                  "h-1 flex-1 rounded-full",
                  i < done - 1 || (completed && i < done) ? "bg-emerald-500" : "bg-white/40",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
