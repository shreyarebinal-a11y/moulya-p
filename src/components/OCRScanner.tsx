import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Camera, Upload, Loader2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onTextExtracted: (text: string) => void;
  onImageCaptured: (image: string | null) => void;
}

export default function OCRScanner({ onTextExtracted, onImageCaptured }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageCaptured(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (image: string) => {
    setIsProcessing(true);
    setProgress(0);
    try {
      const worker = await createWorker('eng+hin+kan+tel', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();
      
      onTextExtracted(text);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Could not read text from image. Please try typing or a clearer photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clear = () => {
    setPreview(null);
    onImageCaptured(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="px-6 mb-8">
      <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold text-xs uppercase tracking-widest leading-none">
        <Camera size={14} />
        Add Notice Photo
      </div>

      <div className="relative">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFile}
          className="hidden" 
          ref={fileInputRef} 
        />
        
        {!preview ? (
          <button
            id="upload-button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-4 py-12 px-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700 text-lg">Click to Take Photo</p>
              <p className="text-sm text-slate-500">or upload from your phone</p>
            </div>
          </button>
        ) : (
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-xl bg-slate-900">
            <img src={preview} alt="Notice preview" className="w-full max-h-64 object-contain opacity-50" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                  <div className="w-48 h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white font-bold animate-pulse">Reading Notice... {progress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform scale-125 mb-2">
                    <Check className="text-white w-7 h-7" />
                  </div>
                  <p className="text-white font-bold text-xl drop-shadow-md text-center">Ready!</p>
                  <p className="text-white/80 text-sm mb-4">Photo loaded successfully</p>
                  <button 
                    onClick={clear}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X size={18} /> Take New Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
