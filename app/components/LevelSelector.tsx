"use client";

import { useRouter } from "next/navigation";

interface LevelSelectorProps {
  totalLevels?: number;
}

export default function LevelSelector({ totalLevels = 100 }: LevelSelectorProps) {
  const router = useRouter();

  const getDifficultyColor = (lvl: number) => {
    if (lvl <= 20) return "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (lvl <= 40) return "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (lvl <= 60) return "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (lvl <= 80) return "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="w-full max-w-4xl bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-slate-300">Poziomy Kampanii (1-100)</h3>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
        {Array.from({ length: totalLevels }).map((_, i) => {
          const lvlNum = i + 1;
          return (
            <button
              key={lvlNum}
              onClick={() => router.push(`/game?mode=campaign&level=${lvlNum}`)}
              className={`aspect-square rounded-xl font-mono text-sm font-bold border transition-all flex items-center justify-center active:scale-95 ${getDifficultyColor(
                lvlNum
              )}`}
            >
              {lvlNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}