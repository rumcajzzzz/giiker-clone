"use client";

import { useState, useEffect } from "react";
import { useGiiker } from "@/hooks/useGiiker";
import GameBoard from "@/components/GameBoard";
import ProgressBar from "@/components/ProgressBar";
import GameControls from "@/components/GameControls";

export default function GiikerGamePage() {
  const [mode, setMode] = useState<"campaign" | "random">("campaign");
  const [level, setLevel] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showLevelList, setShowLevelList] = useState<boolean>(false);
  
  // Stan przechowujący tablicę ukończonych poziomów
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const totalCampaignLevels = 15;

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

  // Wczytywanie ukończonych poziomów z pamięci przeglądarki po uruchomieniu strony
  useEffect(() => {
    const saved = localStorage.getItem("giiker_completed_levels");
    if (saved) {
      try {
        setCompletedLevels(JSON.parse(saved));
      } catch (e) {
        console.error("Błąd wczytywania ukończonych poziomów", e);
      }
    }
  }, []);

  // Automatyczne dodawanie poziomu do ukończonych w momencie wygranej
  useEffect(() => {
    if (hasWon && mode === "campaign") {
      setCompletedLevels((prev) => {
        if (prev.includes(level)) return prev;
        const updated = [...prev, level];
        localStorage.setItem("giiker_completed_levels", JSON.stringify(updated));
        return updated;
      });
    }
  }, [hasWon, level, mode]);

  const handleNextLevel = () => {
    if (level < totalCampaignLevels) {
      setLevel((prev) => prev + 1);
    }
  };

  const selectCampaignLevel = (lvlNum: number) => {
    setLevel(lvlNum);
    setShowLevelList(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] bg-slate-900 text-white font-sans select-none p-4 relative overflow-hidden">
      
      {/* NAGŁÓWEK I WYBÓR TRYBU */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-2 z-10">
        <div className="w-full bg-slate-800 p-1.5 rounded-2xl border border-slate-700/60 flex relative shadow-inner">
          <button
            onClick={() => {
              setMode("campaign");
              setShowLevelList(false);
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${
              mode === "campaign"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kampania
          </button>
          <button
            onClick={() => setMode("random")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${
              mode === "random"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Generator
          </button>
        </div>

        {/* PŁYNNE PRZEJŚCIE KONTROLEK TRYBÓW (Wysokość zablokowana na sztywno, brak skoków układu) */}
        <div className="h-12 relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          {/* Panel Kampanii */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-4 py-2 transition-all duration-300 ease-out ${
              mode === "campaign" 
                ? "opacity-100 translate-x-0 pointer-events-auto" 
                : "opacity-0 -translate-x-8 pointer-events-none"
            }`}
          >
            <span className="text-sm text-slate-400 font-medium">
              Poziom <strong className="text-blue-400 font-mono text-base">{level}</strong> z {totalCampaignLevels}
            </span>
            <button
              onClick={() => setShowLevelList(true)}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 text-blue-400 hover:text-blue-300 transition-colors shadow-sm"
            >
              Lista poziomów
            </button>
          </div>

          {/* Panel Generatora */}
          <div
            className={`absolute inset-0 p-1 flex gap-1 transition-all duration-300 ease-out ${
              mode === "random" 
                ? "opacity-100 translate-x-0 pointer-events-auto" 
                : "opacity-0 translate-x-8 pointer-events-none"
            }`}
          >
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`flex-1 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  difficulty === diff
                    ? diff === "easy"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm"
                      : diff === "medium"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm"
                    : "bg-transparent text-slate-500 border-transparent hover:text-slate-400"
                }`}
              >
                {diff === "easy" ? "Łatwy" : diff === "medium" ? "Średni" : "Trudny"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PASEK POSTĘPU */}
      <div className="w-full max-w-sm z-10">
        <ProgressBar progress={progress} isCalculating={isCalculating} hasWon={hasWon} />
      </div>

      {/* PLANSZA DO GRY */}
      <div className="relative z-10 my-2">
        <GameBoard
          blocks={blocks}
          hintActiveId={hintActiveId}
          onStart={handleStart}
          onMove={handleMove}
          onEnd={handleEnd}
        />
      </div>

      {/* DOLNE KONTROLKI I PRZYCISK NEXT LEVEL */}
      <div className="w-full max-w-sm min-h-[100px] flex flex-col justify-end z-10">
        {hasWon ? (
          <div className="w-full flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-base font-bold text-emerald-400 bg-emerald-950/40 py-2.5 rounded-xl border border-emerald-500/20 text-center shadow-md">
              🎉 Poziom ukończony!
            </div>
            {mode === "campaign" && level < totalCampaignLevels ? (
              <button
                onClick={handleNextLevel}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 active:scale-[0.98] text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-blue-400/30"
              >
                Następny poziom ➔
              </button>
            ) : mode === "random" ? (
              <button
                onClick={resetLevel}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
              >
                Generuj nowy układ ↻
              </button>
            ) : (
              <div className="text-center text-sm font-bold text-amber-400 bg-amber-950/30 py-3 rounded-xl border border-amber-500/20 shadow-inner">
                🏆 Gratulacje! Kampania w całości ukończona!
              </div>
            )}
          </div>
        ) : (
          <GameControls
            onReset={resetLevel}
            onHint={triggerHint}
            isHintDisabled={isCalculating || !bestNextMove || hasWon}
          />
        )}
      </div>

      {/* --- MODAL (OVERLAY) Z LISTĄ POZIOMÓW --- */}
      {/* Nachodzi gładko na kostkę i cały ekran, nie przesuwając elementów pod spodem */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          showLevelList ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowLevelList(false)} // Zamknij po kliknięciu w tło
      >
        <div
          className={`w-full max-w-sm bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-2xl transition-all duration-300 transform ${
            showLevelList ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()} // Zapobiega zamykaniu przy kliknięciu wewnątrz menu
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold tracking-wide text-slate-200">Wybierz poziom kampanii</h3>
            <button
              onClick={() => setShowLevelList(false)}
              className="text-slate-400 hover:text-white bg-slate-900/50 p-1.5 rounded-lg hover:bg-slate-700 border border-slate-700/50 text-xs font-bold transition-colors"
            >
              Zamknij
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {Array.from({ length: totalCampaignLevels }).map((_, i) => {
              const lvlNum = i + 1;
              const isCurrent = level === lvlNum;
              const isCompleted = completedLevels.includes(lvlNum);

              return (
                <button
                  key={lvlNum}
                  onClick={() => selectCampaignLevel(lvlNum)}
                  className={`py-3 rounded-xl font-mono font-black text-sm border transition-all active:scale-90 ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/20"
                      : isCompleted
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  {lvlNum}
                  {isCompleted && !isCurrent && (
                    <span className="block text-[9px] text-emerald-400/70 font-sans font-bold -mt-0.5">✓</span>
                  )}
                  {isCurrent && (
                    <span className="block text-[9px] text-blue-200 font-sans font-bold -mt-0.5">GRA</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}