import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { MusicPlayerState } from "@/hooks/useMusicPlayer";
import ScrambleText from "@/components/ScrambleText";

const formatTime = (s: number) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

interface MusicPlayerProps {
  player: MusicPlayerState;
  infected?: boolean;
}

const MusicPlayer = ({ player, infected = false }: MusicPlayerProps) => {
  const { tracks, currentIndex, isPlaying, currentTime, duration, currentTrack, toggle, next, prev, seek, selectTrack } = player;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Now playing */}
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-20 h-20 rounded-md object-cover border border-border/40"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate"><ScrambleText text={currentTrack.title} infected={infected} /></p>
          <p className="text-xs text-muted-foreground truncate"><ScrambleText text={currentTrack.artist} infected={infected} /></p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1">
        <div
          className="relative h-1.5 w-full bg-muted rounded-full cursor-pointer overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seek(pct * duration);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent-icon rounded-full transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-accent-icon/15 hover:bg-accent-icon/25 flex items-center justify-center text-foreground transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button onClick={next} className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto -mx-1">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => selectTrack(i)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
              i === currentIndex
                ? "bg-accent-icon/10 text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <img src={track.cover} alt="" className="w-8 h-8 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate"><ScrambleText text={track.title} infected={infected} /></p>
              <p className="text-[10px] opacity-70 truncate"><ScrambleText text={track.artist} infected={infected} /></p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
