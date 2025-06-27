/**
 * Type definitions for the application
 */

/**
 * Represents a parsed topic from the Dota 2 forum
 * @property title - The title of the topic
 * @property content - The content of the topic
 */
export interface TopicData {
  title: string | null;
  content: string | null;
}

/**
 * Represents a collection of parsed topics
 * Key is the topic title, value is the topic content
 */
export interface ParsedTopics {
  [title: string]: string;
}

/**
 * API response structure
 */
export interface ApiResponse {
  /** Status message */
  message: string;
  /** Parsed topic data */
  data?: ParsedTopics;
  /** Number of topics parsed */
  count?: number;
  /** Error message if any */
  error?: string;
  /** AI analysis result */
  analysis?: string;
}

/**
 * Parse request parameters
 */
export interface ParseRequest {
  /** URL of the profile to parse */
  url: string;
}

/**
 * Loading state for components
 */
export interface LoadingState {
  /** Whether the component is in a loading state */
  isLoading: boolean;
}

/**
 * Error state for components
 */
export interface ErrorState {
  /** Error message if any */
  error?: string;
}

/**
 * Combined state for components with loading and error states
 */
export type ComponentState = LoadingState & ErrorState;
