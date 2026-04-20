import { useState, useEffect, useRef } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function scramble(original: string): string {
  return original
    .split("")
    .map((ch) => {
      if (ch === " ") return ch;
      // 30-50% of characters get replaced
      return Math.random() < 0.3 + Math.random() * 0.2
        ? CHARS[Math.floor(Math.random() * CHARS.length)]
        : ch;
    })
    .join("");
}

export function useTextScramble(text: string, active: boolean): string {
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    // Random delay 0-3s so each instance corrupts at a different time
    const delay = Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      const scrambled = scramble(text);
      // Reverse the string for extra chaos
      setDisplay(scrambled.split("").reverse().join(""));
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, active]);

  return display;
}
