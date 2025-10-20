import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_ANTHROPIC_API_KEY || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

const anthropic = new Anthropic({
  apiKey,
});

export interface ArticleParams {
  title: string;
  keywords: string;
  targetAudience: string;
  tone: string;
  maxWords: number;
}

export const generateArticle = async (params: ArticleParams): Promise<{ content: string; wordCount: number; error?: string }> => {
  try {
    const prompt = `Generate a professional, SEO-optimized blog article with the following specifications:

Title: ${params.title}
Target Keywords: ${params.keywords}
Target Audience: ${params.targetAudience}
Tone: ${params.tone}
Maximum Word Count: ${params.maxWords}

Requirements:
- Create engaging, well-structured content with clear headings and subheadings
- Naturally integrate the target keywords throughout the article for SEO optimization
- Write in a ${params.tone} tone that resonates with ${params.targetAudience}
- Include an attention-grabbing introduction
- Provide valuable, actionable information in the body
- End with a strong conclusion
- Stay within ${params.maxWords} words maximum
- Use proper formatting with paragraphs and sections
- Make it ready to publish

Please write the complete article now:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    const wordCount = content.trim().split(/\s+/).length;

    return {
      content,
      wordCount,
    };
  } catch (error: any) {
    console.error('Error generating article:', error);
    return {
      content: '',
      wordCount: 0,
      error: error.message || 'Failed to generate article',
    };
  }
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};
