import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedIcon from "@/components/AnimatedIcon";

const THINKING_DURATION = 1500;

const thinkingWords = [
  "percolating", "compiling", "decrypting", "unlocking",
  "vibecoding", "considering", "resolving", "mapping",
];

interface Command {
  label: string;
  text?: string;
  speed?: number;
  links?: { label: string; href: string }[];
  action?: string;
  followUp?: string;
  followUpDelay?: number;
}

interface HistoryEntry {
  label: string;
  text?: string;
  links?: { label: string; href: string }[];
  done: boolean;
}

const TypewriterText = ({
  text,
  speed = 20,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-1.5 h-4 bg-foreground/40 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};

const ThinkingIndicator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % thinkingWords.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-2">
      <motion.span
        className="inline-block w-1.5 h-1.5 rounded-full bg-accent-icon"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {thinkingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

interface TerminalProps {
  commands: Command[];
  embedded?: boolean;
  onAction?: (action: string) => void;
}

const Terminal = ({ commands, embedded = false, onAction }: TerminalProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeCommand, setActiveCommand] = useState<Command | null>(null);
  const [thinking, setThinking] = useState(false);
  const [typing, setTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [followUpText, setFollowUpText] = useState<string | null>(null);
  const [typingFollowUp, setTypingFollowUp] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const activeCommandRef = useRef<Command | null>(null);

  const executedLabels = new Set(history.map((h) => h.label));
  const availableCommands = commands.filter((cmd) => !executedLabels.has(cmd.label));

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, activeCommand, thinking, followUpText, typingFollowUp, scrollToBottom]);

  const handleSelectCommand = (cmd: Command) => {
    setDropdownOpen(false);
    setThinking(true);
    setActiveCommand(cmd);
    activeCommandRef.current = cmd;

    setTimeout(() => {
      setThinking(false);
      if (cmd.links) {
        setHistory((prev) => [
          ...prev,
          { label: cmd.label, links: cmd.links, done: true },
        ]);
        setActiveCommand(null);
        activeCommandRef.current = null;
      } else {
        setTyping(true);
      }
    }, THINKING_DURATION);
  };

  const handleTypewriterComplete = useCallback(() => {
    const cmd = activeCommandRef.current;
    if (!cmd) return;

    // Add the main text to history
    setHistory((prev) => [
      ...prev,
      { label: cmd.label, text: cmd.text, done: true },
    ]);

    // Fire the action
    if (cmd.action && onAction) {
      onAction(cmd.action);
    }

    // If there's a follow-up, schedule it after the delay
    if (cmd.followUp) {
      const delay = cmd.followUpDelay || 2000;
      setActiveCommand(null);
      setTyping(false);
      setTimeout(() => {
        setFollowUpText(cmd.followUp!);
        setTypingFollowUp(true);
      }, delay);
    } else {
      setActiveCommand(null);
      setTyping(false);
    }
    activeCommandRef.current = null;
  }, [onAction]);

  const handleFollowUpComplete = useCallback(() => {
    if (followUpText) {
      setHistory((prev) => [
        ...prev,
        { label: "_followUp", text: followUpText, done: true },
      ]);
    }
    setFollowUpText(null);
    setTypingFollowUp(false);
  }, [followUpText]);

  const isBusy = thinking || typing || typingFollowUp;

  return (
    <div className={embedded ? "flex flex-col h-full" : "w-full sm:w-[720px] h-[500px] flex flex-col border border-border/50 rounded-xl overflow-hidden bg-background/80 backdrop-blur-xl shadow-[0_0_80px_-20px_hsl(var(--accent-icon)/0.15)]"}>
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2">
            <AnimatedIcon />
            <span className="text-xs font-medium tracking-tight text-muted-foreground">syedOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
        </div>
      )}

      <div
        ref={outputRef}
        className="px-5 py-4 flex-1 overflow-y-auto space-y-5 text-[15px] leading-[1.7]"
      >
        {history.length === 0 && !activeCommand && !typingFollowUp && (
          <p className="text-muted-foreground/40 text-xs">select a command to begin.</p>
        )}

        {history.map((entry, i) => (
          <div key={i} className={i < history.length - 1 ? "border-b border-border/20 pb-4" : ""}>
            {entry.text && <p className="text-foreground leading-[1.7]">{entry.text}</p>}
            {entry.links && (
              <div className="flex flex-wrap gap-4">
                {entry.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-icon underline underline-offset-4 decoration-accent-icon/40 hover:decoration-accent-icon transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {activeCommand && !thinking && typing && activeCommand.text && (
          <div>
            <p className="text-foreground leading-[1.7]">
              <TypewriterText
                text={activeCommand.text}
                speed={activeCommand.speed || 20}
                onComplete={handleTypewriterComplete}
              />
            </p>
          </div>
        )}

        {typingFollowUp && followUpText && (
          <div>
            <p className="text-foreground leading-[1.7]">
              <TypewriterText
                text={followUpText}
                speed={25}
                onComplete={handleFollowUpComplete}
              />
            </p>
          </div>
        )}
      </div>

      <div className="relative border-t border-border/40">
        <div
          className={`flex items-center gap-2 px-5 py-3 cursor-pointer select-none ${
            isBusy ? "pointer-events-none" : "hover:bg-muted/10"
          }`}
          onClick={() => {
            if (!isBusy && availableCommands.length > 0) {
              setDropdownOpen((o) => !o);
            }
          }}
        >
          <span className="text-muted-foreground/60 font-mono text-xs">syedOS ~ $</span>
          {thinking ? (
            <ThinkingIndicator />
          ) : (
            <motion.span
              className="inline-block w-1.5 h-4 bg-foreground/40 rounded-sm"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-full left-5 mb-1.5 z-50 min-w-[200px] rounded-lg border border-border/50 bg-popover/95 backdrop-blur-md shadow-lg py-1.5"
            >
              {availableCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleSelectCommand(cmd)}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors rounded-md mx-0"
                >
                  {cmd.label}
                </button>
              ))}
              {availableCommands.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">all commands executed</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Terminal;
