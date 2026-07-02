import { GoogleGenAI } from "@google/genai";
import { TaskPriority } from "../types/task.types";
import { ApiError } from "../utils/ApiError";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AIService {
  async suggestTaskDetails(title: string): Promise<{ description: string; priority: TaskPriority }> {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new ApiError(500, "Gemini API key is missing or invalid");
    }

    try {
      const prompt = `
      You are an intelligent task manager assistant.
      Given the following task title: "${title}"
      
      Suggest a professional and detailed description (1-2 sentences) and a suggested priority.
      Priority must be one of: "LOW", "MEDIUM", "HIGH".
      
      Respond ONLY with a valid JSON object in this format, and no other text or markdown formatting:
      {
        "description": "Your suggested description here",
        "priority": "HIGH"
      }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text;
      
      if (!resultText) {
         throw new Error("Empty response from AI");
      }

      const parsed = JSON.parse(resultText);
      
      // Validate priority
      if (!Object.values(TaskPriority).includes(parsed.priority)) {
        parsed.priority = TaskPriority.MEDIUM;
      }

      return parsed;
    } catch (error: any) {
      console.error("AI Suggestion failed:", error);
      throw new ApiError(500, "Failed to generate AI suggestion");
    }
  }
}

export const aiService = new AIService();
