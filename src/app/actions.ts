'use server';

import {parseUserTopics} from '@/services/dota2-parser.service';
import {analyzeUserPosts} from '@/services/gemini-ai.service';
import {ApiResponse, ParsedTopics} from '@/types';
import {unstable_cache} from "next/cache";

/**
 * Validates the URL from form data and normalizes it by removing trailing slashes
 * @param formData - Form data containing the URL
 * @returns The normalized URL if valid, throws an error otherwise
 */
const validateUrl = (formData: FormData): string => {
    const url = formData.get('url') as string;

    if (!url || typeof url !== 'string') {
        throw new Error('URL is required and must be a string');
    }

    // Remove trailing slash if it exists to ensure consistent cachin
    return url.trim().replace(/\/$/, '');
};

/**
 * Creates a cached version of parseUserTopics for a specific URL
 * @param url - URL to parse
 */
const getParseUserTopicsCached = (url: string) => {
    return unstable_cache(
        (urlParam: string) => parseUserTopics(urlParam),
        [`parseUserTopics-${url}`],
        {
            tags: [url],
            revalidate: 86400,
        }
    );
};

/**
 * Creates a cached version of analyzeUserPosts for a specific URL
 * @param url - URL to parse
 */
const getAnalyzeUserPostsCached = (url: string) => {
    return unstable_cache(
        (results: ParsedTopics, promptParam?: string) => analyzeUserPosts(results, promptParam),
        [`analyzeUserPosts-${url}`],
        {
            tags: [url],
            revalidate: 86400,
        }
    );
};

/**
 * Parses a Dota 2 profile
 * @returns API response with parsing results
 * @param formData
 */
export async function parseProfile(formData: FormData): Promise<ApiResponse> {
    const url = validateUrl(formData);
    const prompt = formData.get('prompt') as string;

    try {
        console.log(`Начинаем парсинг профиля: ${url}`);

        // Get the cached function for this specific URL
        const parseUserTopicsCached = getParseUserTopicsCached(url);

        // Parse the user topics
        const results: ParsedTopics = await parseUserTopicsCached(url);

        // Only analyze if we have results
        let analysis = undefined;
        if (Object.keys(results).length > 0) {
            try {
                console.log('Analyzing user posts with Gemini AI...');
                // Use the cached version if no prompt is provided, otherwise use the original function
                if (!prompt) {
                    const analyzeUserPostsCached = getAnalyzeUserPostsCached(url);
                    analysis = await analyzeUserPostsCached(results, prompt);
                } else {
                    analysis = await analyzeUserPosts(results, prompt);
                }
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
    return parseProfile(formData);
}
