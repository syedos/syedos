import { LucideIcon } from "lucide-react";
import ScrambleText from "@/components/ScrambleText";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  infected?: boolean;
}

const DesktopIcon = ({ icon: Icon, label, selected, onSelect, onOpen, infected = false }: DesktopIconProps) => {
  return (
    <button
      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg w-24 cursor-pointer select-none transition-colors ${
        selected
          ? "bg-accent-icon/20 ring-1 ring-accent-icon/40"
          : "hover:bg-foreground/5"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <div className="w-14 h-14 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 flex items-center justify-center shadow-sm">
        <Icon size={28} className="text-accent-icon" />
      </div>
      <span className="text-xs text-foreground/80 leading-tight text-center truncate w-full drop-shadow-sm">
        <ScrambleText text={label} infected={infected} />
      </span>
    </button>
  );
};

export default DesktopIcon;
