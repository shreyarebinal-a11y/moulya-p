import { GoogleGenAI, Type } from "@google/genai";
import { Language, SimplifiedResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are "GovNotice Simplifier", an AI assistant designed to help rural and non-technical users in India understand complex government notices.
Your goal is to take difficult, legal, or official text and convert it into extremely simple language.
Target Audience: Rural residents, students, elderly people who may not understand technical jargon.

CRITICAL RULES:
1. Use very short sentences.
2. Use active voice and simple common words.
3. If the user selects a language other than English, you MUST provide the translation alongside the English version.
4. Extract key actions like last dates, fees, and required documents.
5. "Explain Like I'm 10 years old" - avoid all legalisms.

You MUST respond in VALID JSON format matching the following schema:
{
  "simpleExplanation": "string",
  "keyPoints": ["string"],
  "whatToDo": ["string"],
  "translatedVersion": "string (only if language is not English)",
  "meta": {
    "lastDate": "string",
    "whoCanApply": "string",
    "requiredDocuments": ["string"],
    "fees": "string"
  }
}
`;

export async function simplifyNotice(
  text: string,
  targetLanguage: Language
): Promise<SimplifiedResult> {
  try {
    const prompt = `
    Input Document Text:
    """
    ${text}
    """

    Target Language: ${targetLanguage}
    Please simplify this. If the language is ${targetLanguage} (and ${targetLanguage} is not English), provide a full explanation in ${targetLanguage} in the 'translatedVersion' field.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            simpleExplanation: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            whatToDo: { type: Type.ARRAY, items: { type: Type.STRING } },
            translatedVersion: { type: Type.STRING },
            meta: {
              type: Type.OBJECT,
              properties: {
                lastDate: { type: Type.STRING },
                whoCanApply: { type: Type.STRING },
                requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
                fees: { type: Type.STRING }
              }
            }
          },
          required: ["simpleExplanation", "keyPoints", "whatToDo", "meta"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as SimplifiedResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to simplify notice. Please try again.");
  }
}
