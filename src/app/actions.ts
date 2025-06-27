'use server';

import { parseUserTopics } from '@/services/dota2-parser.service';
import { analyzeUserPosts } from '@/services/gemini-ai.service';
import { ApiResponse, ParsedTopics } from '@/types';
import {unstable_cache} from "next/cache";

/**
 * Validates the URL from form data
 * @param formData - Form data containing the URL
 * @returns The URL if valid, throws an error otherwise
 */
const validateUrl = (formData: FormData): string => {
  const url = formData.get('url') as string;

  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }

  return url;
};

/**
 * Parses a Dota 2 profile
 * @param url - the URL
 * @returns API response with parsing results
 */
async function parseProfile(url: string): Promise<ApiResponse> {
  try {
    console.log(`Начинаем парсинг профиля: ${url}`);

    // Parse the user topics
    const results: ParsedTopics = await parseUserTopics(url);

    // Only analyze if we have results
    let analysis = undefined;
    if (Object.keys(results).length > 0) {
      try {
        console.log('Analyzing user posts with Gemini AI...');
        analysis = await analyzeUserPosts(results);
        console.log('AI analysis completed successfully');
      } catch (analysisError) {
        console.error('Error during AI analysis:', analysisError);
        // We don't want to fail the whole request if just the AI analysis fails
        // So we continue without the analysis
      }
    }

    return {
      message: 'Parsing successful!',
      data: results,
      count: Object.keys(results).length,
      analysis
    };
  } catch (error) {
    console.error('Ошибка при парсинге:', error);

    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Parsing failed'
    };
  }
}



/**
 * Server action for parsing a profile with URL
 * @param prevState - Previous state
 * @param formData - Form data containing the URL
 * @returns API response with parsing results
 */
export async function parseProfileWithUrl(prevState: ApiResponse, formData: FormData): Promise<ApiResponse> {
  // Validate the URL
  const url = validateUrl(formData);
  const parseProfileCached = unstable_cache(parseProfile, [], {
    tags: [url],
    revalidate: 86400,
  })
  return parseProfileCached(url);
}
