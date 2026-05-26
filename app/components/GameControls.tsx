interface GameControlsProps {
	onReset: () => void;
	onHint: () => void;
	isHintDisabled: boolean;
  }
  
  export default function GameControls({ onReset, onHint, isHintDisabled }: GameControlsProps) {
	return (
	  <div className="flex gap-4 w-full">
		<button
		  onClick={onReset}
		  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-sm font-semibold rounded-xl transition-colors shadow-md border border-slate-600/50"
		>
		  Od nowa
		</button>
		
		<button
		  onClick={onHint}
		  disabled={isHintDisabled}
		  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
			isHintDisabled
			  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
			  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 border border-orange-400"
		  }`}
		>
		  <span>✨</span> Hint
		</button>
	  </div>
	);
  }