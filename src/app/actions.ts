'use server';

import {parseUserTopics} from '@/lib/dota2-parser';
import {analyzeUserPosts} from '@/lib/gemini-ai';
import {ApiResponse,} from '@/types';

export async function parseProfile(formData: FormData): Promise<ApiResponse> {
  const url = formData.get('url') as string;

  if (!url || typeof url !== 'string') {
    return {
      error: 'URL is required and must be a string',
      message: 'Validation error'
    };
  }

  try {
    console.log(`Начинаем парсинг профиля: ${url}`);

    const results = await parseUserTopics(url);

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
      error: 'Parsing failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function parseProfileWithUrl(prevState: ApiResponse, formData: FormData): Promise<ApiResponse> {
  return parseProfile(formData);
}
