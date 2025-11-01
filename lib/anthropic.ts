import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || "";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export const generateRecommendedTitleAnthropic = async (
  originalTitle: string,
  category: string
): Promise<string> => {
  if (!ANTHROPIC_API_KEY) {
    console.warn(
      "Anthropic API key is missing. Cannot generate recommended title."
    );
    return `Recommended: ${originalTitle}`; // Fallback
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Or another suitable Claude model
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: `Given the article title "${originalTitle}" and its category "${category}", suggest a more engaging and concise recommended title (max 10 words). Respond with only the new title.`,
        },
      ],
    });

    let recommendedTitle = `Recommended: ${originalTitle}`; // Default fallback
    if (response.content && response.content.length > 0) {
      const firstContentBlock = response.content[0];
      if (firstContentBlock.type === "text") {
        recommendedTitle = firstContentBlock.text.trim();
      }
    }
    return recommendedTitle.startsWith("Recommended: ")
      ? recommendedTitle
      : `Recommended: ${recommendedTitle}`;
  } catch (error) {
    console.error(
      "Error generating recommended title with Anthropic API:",
      error
    );
    return `Recommended: ${originalTitle}`; // Fallback on error
  }
};
