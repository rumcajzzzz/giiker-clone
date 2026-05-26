"use client";

import { Block } from "@/utils/solver";

interface GameBlockProps {
  block: Block;
  isHinted: boolean;
  onStart: (id: string, clientX: number, clientY: number) => void;
}

const CELL_SIZE = 80;

export default function GameBlock({ block, isHinted, onStart }: GameBlockProps) {
  const isMain = block.id === "main";

  const handleMouseDown = (e: React.MouseEvent) => {
    onStart(block.id, e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      onStart(block.id, e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`absolute cursor-pointer transition-all duration-100 ease-out p-1 ${isHinted ? "z-50" : "z-10"}`}
      style={{
        width: block.width * CELL_SIZE,
        height: block.height * CELL_SIZE,
        transform: `translate(${block.x * CELL_SIZE}px, ${block.y * CELL_SIZE}px)`,
        touchAction: "none",
      }}
    >
      <div
        className={`w-full h-full rounded-2xl shadow-md flex items-center justify-center relative active:scale-[0.95] transition-all duration-300 ${
          isHinted ? "ring-4 ring-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-105" : ""
        }`}
        style={{
          backgroundColor: block.color,
          borderBottom: "6px solid rgba(0,0,0,0.25)",
          borderRight: "2px solid rgba(0,0,0,0.1)",
        }}
      >
        <div className="w-4 h-4 rounded-full bg-black/20 shadow-inner flex items-center justify-center">
          {isMain && <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
        </div>
      </div>
    </div>
  );
}