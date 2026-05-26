interface ProgressBarProps {
	progress: number;
	isCalculating: boolean;
	hasWon: boolean;
  }
  
  export default function ProgressBar({ progress, isCalculating, hasWon }: ProgressBarProps) {
	return (
	  <div className="bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700">
		<div className="flex justify-between text-sm font-semibold mb-2">
		  <span className="text-slate-400">Cel: Uwolnij czerwony blok</span>
		  <span className={progress === 100 ? "text-emerald-400" : "text-blue-400"}>
			{progress}%
		  </span>
		</div>
		<div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden shadow-inner relative">
		  <div
			className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-700 ease-out"
			style={{ width: `${progress}%` }}
		  />
		</div>
		<p className="text-xs text-slate-500 mt-2 h-4">
		  {isCalculating ? (
			<span className="animate-pulse">Analizowanie trasy...</span>
		  ) : hasWon ? (
			<span className="text-emerald-400">Rozwiązane!</span>
		  ) : (
			"Rusz klocek by aktualizować postęp"
		  )}
		</p>
	  </div>
	);
  }