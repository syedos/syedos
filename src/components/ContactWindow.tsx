import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";

const WEB3FORMS_KEY = "408e664b-b8b7-4d7f-b45d-8251f9889cd3";

const ContactWindow = () => {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: from,
          subject,
          message: body,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("failed to send — try again");
      }
    } catch {
      setError("network error — try again");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-sm">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            className="flex-1 flex flex-col items-center justify-center gap-3 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <p className="text-foreground text-center">message sent!</p>
            <button
              onClick={() => {
                setSent(false);
                setFrom("");
                setSubject("");
                setBody("");
              }}
              className="mt-2 text-xs text-accent-icon underline underline-offset-4 hover:text-foreground transition-colors"
            >
              compose another
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="compose"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Header fields */}
            <div className="border-b border-border/40 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-14 text-right text-xs">to:</span>
                <span className="text-foreground text-xs bg-muted/30 px-2 py-1 rounded flex-1">
                  hello@syedos.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-14 text-right text-xs">from:</span>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="your name or email"
                  className="flex-1 bg-transparent border border-border/40 rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-icon/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-14 text-right text-xs">subj:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="subject"
                  className="flex-1 bg-transparent border border-border/40 rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-icon/50"
                />
              </div>
            </div>

            {/* Body */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="write your message..."
              className="flex-1 bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none"
            />

            {/* Error */}
            {error && (
              <p className="text-destructive text-xs px-3 py-1">{error}</p>
            )}

            {/* Send bar */}
            <div className="border-t border-border/40 p-2 flex justify-end">
              <button
                onClick={handleSend}
                disabled={!from.trim() || !body.trim() || sending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent-icon/20 text-accent-icon text-xs hover:bg-accent-icon/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                {sending ? "sending..." : "send"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactWindow;
