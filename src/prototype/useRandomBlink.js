import { useEffect, useState } from "react";

/**
 * useRandomBlink — returns `true` for ~120ms every 3–5s. Keeps characters
 * feeling alive across all states.
 */
export function useRandomBlink() {
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let alive = true;
    let t1, t2;
    const loop = () => {
      const delay = 3000 + Math.random() * 2000;
      t1 = setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        t2 = setTimeout(() => {
          if (!alive) return;
          setBlinking(false);
          loop();
        }, 120);
      }, delay);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return blinking;
}
