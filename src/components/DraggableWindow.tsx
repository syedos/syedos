import { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import ScrambleText from "@/components/ScrambleText";

interface DraggableWindowProps {
  id: string;
  title: string;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onUpdatePosition: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
  infected?: boolean;
}

const DraggableWindow = ({
  title,
  zIndex,
  position,
  size,
  onClose,
  onMinimize,
  onFocus,
  onUpdatePosition,
  children,
  infected = false,
}: DraggableWindowProps) => {
  const isMobile = useIsMobile();
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return;
      onFocus();
      setDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        posX: position.x,
        posY: position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [position, onFocus, isMobile]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || !dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      onUpdatePosition({
        x: dragRef.current.posX + dx,
        y: dragRef.current.posY + dy,
      });
    },
    [dragging, onUpdatePosition]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-x-0 top-0 z-50 flex flex-col h-[100dvh] bg-background/95 backdrop-blur-xl"
        onPointerDown={onFocus}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors" />
            <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs font-medium text-muted-foreground"><ScrambleText text={title} infected={infected} /></span>
          <div className="w-14" />
        </div>
        <div className="flex-1 overflow-auto pb-12">{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute flex flex-col rounded-xl overflow-hidden border border-border/50 bg-background/80 backdrop-blur-xl shadow-[0_0_80px_-20px_hsl(var(--accent-icon)/0.15)]"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onPointerDown={onFocus}
    >
      {/* Title bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/20 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-2.5 h-2.5 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <span className="text-xs font-medium text-muted-foreground select-none"><ScrambleText text={title} infected={infected} /></span>
        <div className="w-12" />
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default DraggableWindow;
