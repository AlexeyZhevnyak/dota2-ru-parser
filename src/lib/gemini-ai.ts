import {GoogleGenAI} from '@google/genai';

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY || ''});

/**
 * Analyzes user forum posts using Gemini AI
 * @param posts - Object containing user forum posts (title: content)
 * @returns Promise with the AI analysis result
 */
export async function analyzeUserPosts(posts: Record<string, string>): Promise<string> {
    try {
        // Convert posts object to a more readable format for the AI
        const formattedPosts = Object.entries(posts)
            .map(([title, content]) => `Тема: ${title}\nСодержание: ${content}`)
            .join('\n\n---\n\n');

        // Create a prompt for the AI
        const prompt = `На основе предоставленных постов пользователя на форуме, составь его психологический портрет и поставь ему психиатрический диагноз\n\nПосты пользователя:\n${formattedPosts}`;

        // Get the generative model (Gemini 2.5 Flash)

        // Generate content
        const result = await genAI.models.generateContent({model: 'gemini-2.5-flash', contents: prompt})

        return result.text || '';
    } catch (error) {
        console.error('Error analyzing user posts with Gemini AI:', error);
        throw new Error('Failed to analyze user posts with AI');
    }
}