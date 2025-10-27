import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn(
    "Gemini API key is not set. Please create a .env file and add EXPO_PUBLIC_GEMINI_API_KEY"
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateSuggestions = async (
  category: string,
  field: "title" | "keywords" | "audience"
) => {
  if (!API_KEY) {
    return { error: "Gemini API key is not configured." };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `Generate 5 ${field} suggestions for a blog post in the "${category}" category.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const suggestions = text
      .split("\n")
      .map((s: string) => s.replace(/^- /, ""))
      .filter(Boolean);

    return { suggestions };
  } catch (error) {
    return {
      error: (error as Error).message || "Failed to generate suggestions.",
    };
  }
};

export const getTrendingTopics = async (category: string) => {
  if (!API_KEY) {
    return { error: "Gemini API key is not configured." };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `Generate a list of 5 trending topics for blog posts in the "${category}" category. For each topic, provide a catchy title and a brief, one-sentence description. Format the output as a JSON array of objects, where each object has "title" and "description" keys.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to get a valid JSON string
    const jsonString = text.replace(/```json\n|```/g, "").trim();
    const topics = JSON.parse(jsonString);

    return { topics };
  } catch (error) {
    console.error("Failed to fetch trending topics from Gemini:", error);
    return {
      error: (error as Error).message || "Failed to fetch trending topics.",
    };
  }
};
