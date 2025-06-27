/**
 * Gemini AI Service
 * Handles interaction with Google's Gemini AI
 */

import { GoogleGenAI } from '@google/genai';
import { AI_CONFIG } from '@/config';
import { ParsedTopics } from '@/types';

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

/**
 * Formats posts for AI analysis
 * @param posts - Object containing user forum posts (title: content)
 * @returns Formatted posts string
 */
const formatPostsForAnalysis = (posts: ParsedTopics): string => {
  return Object.entries(posts)
    .map(([title, content]) => `Тема: ${title}\nСодержание: ${content}`)
    .join('\n\n---\n\n');
};

/**
 * Creates a prompt for AI analysis
 * @param formattedPosts - Formatted posts string
 * @returns Complete prompt for AI
 */
const createAnalysisPrompt = (formattedPosts: string): string => {
  return AI_CONFIG.DEFAULT_PROMPT.replace('{posts}', formattedPosts);
};

/**
 * Analyzes user forum posts using Gemini AI
 * @param posts - Object containing user forum posts (title: content)
 * @returns Promise with the AI analysis result
 */
export const analyzeUserPosts = async (posts: ParsedTopics): Promise<string> => {
  try {
    // Validate input
    if (!posts || Object.keys(posts).length === 0) {
      throw new Error('No posts provided for analysis');
    }

    // Format posts for the AI
    const formattedPosts = formatPostsForAnalysis(posts);

    // Create the prompt
    const prompt = createAnalysisPrompt(formattedPosts);

    // Generate content using the specified model
    const result = await genAI.models.generateContent({
      model: AI_CONFIG.MODEL,
      contents: prompt
    });

    // Return the generated text or an empty string if no text was generated
    return result.text || '';
  } catch (error) {
    console.error('Error analyzing user posts with Gemini AI:', error);
    throw new Error('Failed to analyze user posts with AI');
  }
};