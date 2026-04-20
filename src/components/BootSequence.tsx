import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const bootLines = [
  { label: "syedOS v1.0.0", status: "" },
  { label: "loading kernel modules...", status: "[OK]" },
  { label: "initializing display server...", status: "[OK]" },
  { label: "mounting filesystem...", status: "[OK]" },
  { label: "starting network services...", status: "[OK]" },
  { label: "loading user profile...", status: "[OK]" },
  { label: "starting desktop environment...", status: "[OK]" },
];

const shutdownLines = [
  { label: "saving session state...", status: "[OK]" },
  { label: "stopping desktop environment...", status: "[OK]" },
  { label: "unmounting filesystem...", status: "[OK]" },
  { label: "shutting down network services...", status: "[OK]" },
  { label: "powering off...", status: "" },
];

interface BootSequenceProps {
  mode: "boot" | "shutdown";
  onComplete: () => void;
}

const BootSequence = ({ mode, onComplete }: BootSequenceProps) => {
  const lines = mode === "boot" ? bootLines : shutdownLines;
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showStatus, setShowStatus] = useState<boolean[]>(lines.map(() => false));

  useEffect(() => {
    if (visibleLines >= lines.length) {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }

    const lineDelay = setTimeout(() => {
      setVisibleLines((v) => v + 1);

      if (lines[visibleLines].status) {
        const statusDelay = setTimeout(() => {
          setShowStatus((prev) => {
            const next = [...prev];
            next[visibleLines] = true;
            return next;
          });
        }, 150);
        return () => clearTimeout(statusDelay);
      }
    }, visibleLines === 0 ? 300 : 200);

    return () => clearTimeout(lineDelay);
  }, [visibleLines, lines, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-mono text-sm text-muted-foreground space-y-1 min-w-[340px] max-w-[500px] px-6">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex justify-between gap-6">
            <span className={i === 0 && mode === "boot" ? "text-foreground font-bold" : ""}>
              {line.label}
            </span>
            {line.status && (
              <span
                className={`text-accent-icon transition-opacity duration-150 ${
                  showStatus[i] ? "opacity-100" : "opacity-0"
                }`}
              >
                {line.status}
              </span>
            )}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-foreground/40 animate-pulse" />
        )}
      </div>
    </motion.div>
  );
};

export default BootSequence;
