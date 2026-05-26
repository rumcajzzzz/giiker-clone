"use client";

import { Block } from "@/utils/solver";
import GameBlock from "./GameBlock";

interface GameBoardProps {
  blocks: Block[];
  hintActiveId: string | null;
  onStart: (id: string, clientX: number, clientY: number) => void;
  onMove: (clientX: number, clientY: number) => void;
  onEnd: () => void;
}

const GRID_WIDTH = 4;
const GRID_HEIGHT = 5;
const CELL_SIZE = 80;

export default function GameBoard({ blocks, hintActiveId, onStart, onMove, onEnd }: GameBoardProps) {
  return (
    <div className="relative p-6 bg-slate-800 rounded-3xl shadow-2xl border-4 border-slate-700">
      <div
        className="relative bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-900 shadow-inner"
        style={{ width: GRID_WIDTH * CELL_SIZE, height: GRID_HEIGHT * CELL_SIZE }}
        onMouseMove={(e) => onMove(e.clientX, e.clientY)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchMove={(e) => {
          if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={onEnd}
      >
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 pointer-events-none opacity-10">
          {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map((_, i) => (
            <div key={i} className="border border-white m-1 rounded-sm" />
          ))}
        </div>

        {blocks.map((block) => (
          <GameBlock
            key={block.id}
            block={block}
            isHinted={hintActiveId === block.id}
            onStart={onStart}
          />
        ))}

        <div className="absolute bottom-0 left-[80px] w-[160px] h-[6px] bg-red-500/50 blur-[2px] pointer-events-none" />
      </div>
    </div>
  );
}