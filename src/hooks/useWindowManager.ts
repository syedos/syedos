import { useState, useCallback } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon?: string;
  minimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface UseWindowManagerReturn {
  windows: WindowState[];
  openWindow: (id: string, title: string, defaultSize?: { width: number; height: number }, defaultPosition?: { x: number; y: number }, icon?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  isOpen: (id: string) => boolean;
}

let zCounter = 10;

export function useWindowManager(): UseWindowManagerReturn {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const isOpen = useCallback(
    (id: string) => windows.some((w) => w.id === id),
    [windows]
  );

  const openWindow = useCallback(
    (id: string, title: string, defaultSize = { width: 520, height: 360 }, defaultPosition?: { x: number; y: number }, icon?: string) => {
      setWindows((prev) => {
        if (prev.some((w) => w.id === id)) {
          return prev.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: ++zCounter } : w
          );
        }
        const offset = prev.length * 30;
        const position = defaultPosition || { x: 120 + offset, y: 60 + offset };
        return [
          ...prev,
          {
            id,
            title,
            icon,
            minimized: false,
            zIndex: ++zCounter,
            position,
            size: defaultSize,
          },
        ];
      });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: ++zCounter } : w
      )
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounter } : w))
    );
  }, []);

  const updatePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    updatePosition,
    isOpen,
  };
}
