import { useEffect, useState } from "react";

/**
 * useRandomBlink — subconscious, eased blinks.
 * - 3–8s between blinks, ~25% chance of a quick double blink.
 * - Pauses while `enabled` is false (e.g. during a success expression peak).
 */
export function useRandomBlink(enabled = true) {
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setBlinking(false);
      return;
    }
    let alive = true;
    const timers = [];
    const blinkOnce = (dur = 110) => {
      setBlinking(true);
      timers.push(
        setTimeout(() => {
          if (alive) setBlinking(false);
        }, dur)
      );
    };
    const schedule = () => {
      const delay = 3000 + Math.random() * 5000; // 3–8s
      timers.push(
        setTimeout(() => {
          if (!alive) return;
          blinkOnce();
          if (Math.random() < 0.25) timers.push(setTimeout(() => blinkOnce(), 250)); // double
          schedule();
        }, delay)
      );
    };
    schedule();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [enabled]);
  return blinking;
}
