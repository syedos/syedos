import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BootSequence from "@/components/BootSequence";
import SleepScreen from "@/components/SleepScreen";
import Desktop from "@/components/Desktop";

type Phase = "booting" | "desktop" | "shutting-down" | "sleeping" | "restarting";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("booting");

  return (
    <AnimatePresence mode="wait">
      {phase === "booting" && (
        <BootSequence key="boot" mode="boot" onComplete={() => setPhase("desktop")} />
      )}

      {phase === "desktop" && (
        <Desktop
          key="desktop"
          onSleep={() => setPhase("shutting-down")}
          onRestart={() => setPhase("restarting")}
        />
      )}

      {phase === "shutting-down" && (
        <BootSequence
          key="shutdown"
          mode="shutdown"
          onComplete={() => setPhase("sleeping")}
        />
      )}

      {phase === "restarting" && (
        <BootSequence
          key="restart-down"
          mode="shutdown"
          onComplete={() => setPhase("booting")}
        />
      )}

      {phase === "sleeping" && (
        <SleepScreen key="sleep" onWake={() => setPhase("booting")} />
      )}
    </AnimatePresence>
  );
};

export default Index;
