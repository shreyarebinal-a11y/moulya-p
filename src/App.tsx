import { useState } from "react";
import { Language, GovNoticeState, SimplifiedResult } from "./types";
import { simplifyNotice } from "./services/geminiService";
import Header from "./components/Header";
import LanguageSelector from "./components/LanguageSelector";
import OCRScanner from "./components/OCRScanner";
import ResultDisplay from "./components/ResultDisplay";
import { Send, History, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [state, setState] = useState<GovNoticeState>({
    inputText: "",
    inputImage: null,
    selectedLanguage: Language.ENGLISH,
    simplifiedData: null,
    isProcessing: false,
    error: null,
  });

  const [isChildMode, setIsChildMode] = useState(false);

  const handleSimplify = async () => {
    if (!state.inputText.trim()) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null, simplifiedData: null }));
    
    try {
      const result = await simplifyNotice(
        state.inputText + (isChildMode ? " (Explain this like I am 10 years old using very basic words)" : ""), 
        state.selectedLanguage
      );
      setState(prev => ({ ...prev, simplifiedData: result, isProcessing: false }));
      
      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setState(prev => ({ ...prev, error: "Something went wrong. Check your internet.", isProcessing: false }));
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-slate-50 relative pb-20">
      <Header />

      <main>
        {/* Language Selection */}
        <LanguageSelector 
          selected={state.selectedLanguage} 
          onSelect={(lang) => setState(prev => ({ ...prev, selectedLanguage: lang }))} 
        />

        {/* OCR / Image Upload */}
        <OCRScanner 
          onTextExtracted={(text) => setState(prev => ({ ...prev, inputText: text }))}
          onImageCaptured={(img) => setState(prev => ({ ...prev, inputImage: img }))}
        />

        {/* Text Input Option */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest leading-none">
              <History size={14} />
              Details from Notice
            </div>
          </div>
          <div className="relative">
            <textarea
              id="notice-text-area"
              value={state.inputText}
              onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
              placeholder="Notice text will appear here after photo, or you can type here..."
              className="w-full min-h-32 p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm focus:border-emerald-500 focus:ring-0 transition-all text-slate-700 font-medium placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Options & Action */}
        <div className="px-6 mb-12 space-y-6">
          <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 leading-none mb-1 text-sm">Super Simple Mode</p>
                <p className="text-xs text-slate-500 font-medium tracking-tight">Explain like I'm 10 years old</p>
              </div>
            </div>
            <button 
              id="child-mode-toggle"
              onClick={() => setIsChildMode(!isChildMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isChildMode ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ${isChildMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            id="simplify-button"
            disabled={!state.inputText || state.isProcessing}
            onClick={handleSimplify}
            className={`action-button w-full shadow-emerald-200 py-5 ${(!state.inputText || state.isProcessing) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            {state.isProcessing ? (
              <>
                <Loader2 className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={20} />
                Simplify This Notice
              </>
            )}
          </button>

          {state.error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100"
            >
              <AlertCircle size={20} />
              <p className="font-bold text-sm">{state.error}</p>
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div id="results-section">
          <AnimatePresence>
            {state.simplifiedData && !state.isProcessing && (
              <ResultDisplay 
                data={state.simplifiedData} 
                language={state.selectedLanguage} 
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Offline Footer Indicator */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto px-6 py-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          System Online
        </div>
        <p>© 2026 GovNotice</p>
      </footer>
    </div>
  );
}
