import { motion } from "framer-motion";
import profilePic from "@/assets/syedos.png";

interface SleepScreenProps {
  onWake: () => void;
}

const SleepScreen = ({ onWake }: SleepScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-background flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onWake}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={profilePic}
          alt="syedOS"
          className="w-20 h-20 rounded-full border border-border"
        />
        <span className="text-muted-foreground/40 text-xs font-mono">click to wake</span>
      </motion.div>
    </motion.div>
  );
};

export default SleepScreen;
