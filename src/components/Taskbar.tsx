import { useState, useEffect } from "react";
import { Mail, Moon, RotateCcw, Pause, Play, User, Briefcase, Lightbulb, BookOpen, Link, TerminalSquare, Music, Github, LucideIcon } from "lucide-react";
import { WindowState } from "@/hooks/useWindowManager";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import profilePic from "@/assets/syedos.png";
import ScrambleText from "@/components/ScrambleText";

interface NowPlaying {
  title: string;
  artist: string;
  cover: string;
  isPlaying: boolean;
  onToggle: () => void;
}

interface TaskbarProps {
  windows: WindowState[];
  onClickWindow: (id: string) => void;
  onLogoClick: () => void;
  onSleep: () => void;
  onRestart: () => void;
  nowPlaying?: NowPlaying;
  infected?: boolean;
}

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      {timeStr}
    </span>
  );
};

const NowPlayingTicker = ({ nowPlaying, infected = false }: { nowPlaying: NowPlaying; infected?: boolean }) => {
  const displayText = infected
    ? `${nowPlaying.title} — ${nowPlaying.artist}`.split("").reverse().join("")
    : `${nowPlaying.title} — ${nowPlaying.artist}`;

  return (
    <div className="flex items-center gap-1.5 px-2 max-w-[200px]">
      <img src={nowPlaying.cover} alt="" className="w-5 h-5 rounded-sm object-cover flex-shrink-0" />
      <div className="overflow-hidden flex-1 min-w-0">
        <div className={`whitespace-nowrap text-[10px] text-muted-foreground ${nowPlaying.isPlaying ? "marquee-scroll" : ""}`}>
          {displayText}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nowPlaying.onToggle();
        }}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {nowPlaying.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>
    </div>
  );
};

const iconMap: Record<string, LucideIcon> = {
  User, Briefcase, Lightbulb, BookOpen, Link, TerminalSquare, Music, Github, Mail,
};

const Taskbar = ({ windows, onClickWindow, onLogoClick, onSleep, onRestart, nowPlaying, infected = false }: TaskbarProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-11 bg-background/70 backdrop-blur-xl border-t border-border/40 flex items-center px-3 gap-2 z-[9999]">
      {/* Start Menu — syedOS logo */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 h-full px-3 hover:bg-muted/30 transition-colors"
          >
            <img src={profilePic} alt="syedOS" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
              <ScrambleText text="syedOS" infected={infected} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-40 p-1.5 bg-background/90 backdrop-blur-xl border-border/40"
        >
          <button
            onClick={onLogoClick}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted/50 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Compose
          </button>
          <button
            onClick={onSleep}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted/50 transition-colors"
          >
            <Moon className="w-3.5 h-3.5" />
            Sleep
          </button>
          <button
            onClick={onRestart}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </PopoverContent>
      </Popover>

      {/* Divider */}
      <div className="w-px h-full bg-border/40" />

      {/* Window buttons */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto px-1">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => onClickWindow(win.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-colors truncate max-w-[140px] ${
              win.minimized
                ? "text-muted-foreground bg-muted/30 hover:bg-muted/50"
                : "text-foreground bg-accent-icon/10 hover:bg-accent-icon/20"
            }`}
          >
            {win.icon && iconMap[win.icon] && (() => { const Icon = iconMap[win.icon!]; return <Icon className="w-3 h-3 flex-shrink-0" />; })()}
            <ScrambleText text={win.title} infected={infected} />
          </button>
        ))}
      </div>

      {/* Now playing ticker */}
      {nowPlaying && <NowPlayingTicker nowPlaying={nowPlaying} infected={infected} />}

      {/* Clock */}
      <Clock />
    </div>
  );
};

export default Taskbar;
