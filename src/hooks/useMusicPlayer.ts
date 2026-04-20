import { useRef, useState, useEffect, useCallback } from "react";

export interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

export const TRACKS: Track[] = [
  {
    title: "Everybody Wants To Rule The World",
    artist: "Tears for Fears",
    src: "/music/everybody-wants-to-rule-the-world.mp3",
    cover: "/music/covers/tears-for-fears.jpg",
  },
  {
    title: "Cruel Summer",
    artist: "Bananarama",
    src: "/music/cruel-summer.mp3",
    cover: "/music/covers/bananarama.jpg",
  },
  {
    title: "The Boys of Summer",
    artist: "Don Henley",
    src: "/music/the-boys-of-summer.mp3",
    cover: "/music/covers/don-henley.jpg",
  },
  {
    title: "Don't You Forget About Me",
    artist: "Simple Minds",
    src: "/music/dont-you-forget-about-me.mp3",
    cover: "/music/covers/simple-minds.jpg",
  },
];

export interface MusicPlayerState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  selectTrack: (index: number) => void;
}

export function useMusicPlayer(infected = false): MusicPlayerState {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = TRACKS[0].src;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % TRACKS.length;
        audio.src = TRACKS[next].src;
        audio.play();
        return next;
      });
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  // Reverse-seek loop when infected
  useEffect(() => {
    if (!infected || !isPlaying) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (Math.random() < 0.5) return;
      const newTime = audio.currentTime - 2;
      if (newTime <= 0) {
        audio.currentTime = audio.duration || 0;
      } else {
        audio.currentTime = newTime;
      }
    }, 400);
    return () => clearInterval(interval);
  }, [infected, isPlaying]);

  const play = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const selectTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrentIndex(index);
      audio.src = TRACKS[index].src;
      audio.play();
      setIsPlaying(true);
    },
    []
  );

  const next = useCallback(() => {
    selectTrack((currentIndex + 1) % TRACKS.length);
  }, [currentIndex, selectTrack]);

  const prev = useCallback(() => {
    selectTrack((currentIndex - 1 + TRACKS.length) % TRACKS.length);
  }, [currentIndex, selectTrack]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  return {
    tracks: TRACKS,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    currentTrack: TRACKS[currentIndex],
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    selectTrack,
  };
}
