import { Info } from "lucide-react";

export default function Header() {
  return (
    <header className="px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Info className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl text-slate-900 leading-tight">Notice</h1>
          <p className="text-emerald-600 font-bold -mt-1 uppercase tracking-wider text-xs">Simplifier</p>
        </div>
      </div>
      <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Live AI</span>
      </div>
    </header>
  );
}
