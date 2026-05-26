"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGiiker } from "@/hooks/useGiiker";
import GameBoard from "@/components/GameBoard";
import ProgressBar from "@/components/ProgressBar";
import GameControls from "@/components/GameControls";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = (searchParams.get("mode") as "campaign" | "random") || "campaign";
  const level = parseInt(searchParams.get("level") || "1", 10);
  const difficulty = (searchParams.get("difficulty") as "easy" | "medium" | "hard") || "medium";

  const {
    blocks,
    progress,
    isCalculating,
    hasWon,
    hintActiveId,
    bestNextMove,
    triggerHint,
    resetLevel,
    handleStart,
    handleMove,
    handleEnd,
  } = useGiiker({ mode, level, difficulty });

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] bg-slate-900 text-white font-sans select-none p-4">
      
      <div className="w-full max-w-sm flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Menu główne
        </button>
        <span className="text-xs font-mono uppercase tracking-widest px-2 py-1 bg-slate-800 rounded-md border border-slate-700 text-slate-400">
          {mode === "campaign" ? `Poziom ${level}` : `Random: ${difficulty}`}
        </span>
      </div>

      <div className="mb-6 text-center w-full max-w-sm">
        <ProgressBar 
          progress={progress} 
          isCalculating={isCalculating} 
          hasWon={hasWon} 
        />
      </div>

      <GameBoard
        blocks={blocks}
        hintActiveId={hintActiveId}
        onStart={handleStart}
        onMove={handleMove}
        onEnd={handleEnd}
      />

      <div className="mt-6 w-full max-w-sm">
        {hasWon && (
          <div className="text-xl font-bold text-emerald-400 bg-emerald-950/50 px-6 py-2 rounded-full border border-emerald-500/30 animate-bounce text-center mb-4">
            🎉 Poziom ukończony!
          </div>
        )}

        <GameControls
          onReset={resetLevel}
          onHint={triggerHint}
          isHintDisabled={isCalculating || !bestNextMove || hasWon}
        />
      </div>
    </div>
  );
}
export default function GamePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-400 animate-pulse">Inicjalizacja układu...</p>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}