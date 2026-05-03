import { Language } from "../types";
import { Globe } from "lucide-react";

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

export default function LanguageSelector({ selected, onSelect }: Props) {
  const languages = Object.values(Language);

  return (
    <div className="px-6 mb-8">
      <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold text-xs uppercase tracking-widest">
        <Globe size={14} />
        Choose Your Language
      </div>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang}
            id={`lang-${lang.toLowerCase()}`}
            onClick={() => onSelect(lang)}
            className={`
              flex items-center justify-center py-3 px-4 rounded-2xl font-medium transition-all
              ${selected === lang 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-200 shadow-sm"
              }
            `}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
