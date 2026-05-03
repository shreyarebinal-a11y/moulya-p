export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  KANNADA = 'Kannada',
  TELUGU = 'Telugu'
}

export interface SimplifiedResult {
  simpleExplanation: string;
  keyPoints: string[];
  whatToDo: string[];
  translatedVersion?: string;
  meta: {
    lastDate?: string;
    whoCanApply?: string;
    requiredDocuments?: string[];
    fees?: string;
  };
}

export interface GovNoticeState {
  inputText: string;
  inputImage: string | null;
  selectedLanguage: Language;
  simplifiedData: SimplifiedResult | null;
  isProcessing: boolean;
  error: string | null;
}
