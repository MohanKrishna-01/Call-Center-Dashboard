import { GoogleGenAI } from "@google/genai";
import { CallRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert Call Center Operations Manager and Data Analyst. 
Your goal is to analyze the provided call center dataset to identify efficiency trends, agent performance issues, and customer satisfaction drivers.
Provide professional, actionable, and concise insights using Markdown.
Focus on metrics like Answer Rate, Resolution Rate, Average Handling Time (AHT), and CSAT (Customer Satisfaction).
Do not provide generic advice; base your insights specifically on the data provided.`;

export const analyzePortfolio = async (data: CallRecord[]): Promise<string> => {
  try {
    // Summarize data for the prompt to avoid token limits with large datasets
    const summary = {
      totalCalls: data.length,
      avgSatisfaction: (data.reduce((acc, curr) => acc + curr.satisfactionRating, 0) / data.length).toFixed(2),
      avgDuration: (data.reduce((acc, curr) => acc + curr.duration, 0) / data.length).toFixed(2),
      resolutionRate: ((data.filter(c => c.resolved).length / data.length) * 100).toFixed(1) + "%",
      unanswered: data.filter(c => !c.answered).length,
      agents: [...new Set(data.map(d => d.agentName))],
      topics: [...new Set(data.map(d => d.topic))]
    };

    // Sample of first 15 records for context
    const sampleRecords = JSON.stringify(data.slice(0, 15));

    const prompt = `Here is a summary of the Call Center Report:
    ${JSON.stringify(summary, null, 2)}

    Here is a sample of the individual call logs:
    ${sampleRecords}

    Please provide a comprehensive operational analysis covering:
    1. **Overall Performance**: How is the team performing on key metrics (Resolution, CSAT)?
    2. **Agent Efficiency**: Identify top performers and those needing coaching based on resolution/satisfaction.
    3. **Topic Trends**: Which issues are taking the longest to resolve or have lower satisfaction?
    4. **Operational Risks**: Any red flags (e.g., high abandon rate, low resolution)?
    5. **Recommendations**: 2-3 specific actions to improve operations.
    
    Keep it structured, under 400 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate operational analysis at this time. Please check your API key and try again.";
  }
};

export const getMarketNews = async (query: string, context: string): Promise<{ summary: string; links: any[] }> => {
  try {
    const prompt = `Find the latest best practices or news regarding "${query}" in the context of ${context}. 
    Summarize 3 key insights from the last year that could help improve call center operations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      }
    });

    const summary = response.text || "No insights found.";
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { summary, links };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { summary: "Unable to fetch industry insights.", links: [] };
  }
};
