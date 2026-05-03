import { SimplifiedResult, Language } from "../types";
import { Volume2, Calendar, Users, FileText, IndianRupee, ListChecks, ArrowRight, Languages } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  data: SimplifiedResult;
  language: Language;
}

export default function ResultDisplay({ data, language }: Props) {
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a voice for the selected language if possible
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="px-6 pb-12 space-y-8">
      {/* Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rural-card border-brand-primary/30 bg-brand-bg shadow-emerald-100"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Simple Explanation
          </div>
          <button 
            id="speak-summary"
            onClick={() => speak(data.simpleExplanation)}
            className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center text-emerald-600 hover:scale-110 active:scale-95 transition-all"
          >
            <Volume2 size={20} />
          </button>
        </div>
        <p className="text-xl font-medium leading-relaxed text-slate-800">
          {data.simpleExplanation}
        </p>
      </motion.div>

      {/* Translated Version (If not English) */}
      {language !== Language.ENGLISH && data.translatedVersion && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rural-card border-slate-900/10 bg-slate-900 text-white"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 bg-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              <Languages size={14} />
              {language} Version
            </div>
            <button 
              id="speak-translated"
              onClick={() => speak(data.translatedVersion!)}
              className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-2xl font-bold leading-relaxed">
            {data.translatedVersion}
          </p>
        </motion.div>
      )}

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        {data.meta.lastDate && (
          <div className="rural-card p-4">
            <Calendar className="text-red-500 mb-2" size={24} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Date</p>
            <p className="font-bold text-lg leading-tight text-red-600">{data.meta.lastDate}</p>
          </div>
        )}
        {data.meta.fees && (
          <div className="rural-card p-4">
            <IndianRupee className="text-blue-500 mb-2" size={24} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fees</p>
            <p className="font-bold text-lg leading-tight text-slate-800">{data.meta.fees}</p>
          </div>
        )}
        {data.meta.whoCanApply && (
          <div className="rural-card p-4 col-span-2">
            <Users className="text-orange-500 mb-2" size={24} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Who can Apply?</p>
            <p className="font-bold text-lg leading-tight text-slate-800">{data.meta.whoCanApply}</p>
          </div>
        )}
      </div>

      {/* Documents Needed */}
      {data.meta.requiredDocuments && data.meta.requiredDocuments.length > 0 && (
        <div className="rural-card space-y-4">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest leading-none">
            <FileText size={16} className="text-emerald-500" />
            Documents Needed
          </div>
          <ul className="space-y-3">
            {data.meta.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                  {i + 1}
                </div>
                <span className="font-medium text-slate-700">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Steps */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest leading-none px-2">
          <ListChecks size={16} className="text-emerald-500" />
          What You Should Do
        </div>
        <div className="space-y-4">
          {data.whatToDo.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-stretch group"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-100 flex-shrink-0">
                  {i + 1}
                </div>
                {i < data.whatToDo.length - 1 && (
                  <div className="w-0.5 grow bg-emerald-200 my-1 rounded-full" />
                )}
              </div>
              <div className="pb-6 pt-1">
                <p className="text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                  {step}
                </p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Next Step <ArrowRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
