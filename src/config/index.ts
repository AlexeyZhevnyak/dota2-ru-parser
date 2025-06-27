/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  // Number of pages to scrape from the Dota 2 forum
  PAGES_TO_SCRAPE: 3,
  
  // HTTP headers for requests
  HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  // Base URLs
  BASE_URLS: {
    DOTA2_RU: 'https://dota2.ru',
  }
};

// AI configuration
export const AI_CONFIG = {
  // Default prompt template for AI analysis
  DEFAULT_PROMPT: 'На основе предоставленных постов пользователя на форуме, составь его психологический портрет и поставь ему психиатрический диагноз\n\nПосты пользователя:\n{posts}',
  
  // AI model to use
  MODEL: 'gemini-2.5-flash',
};

// UI configuration
export const UI_CONFIG = {
  // Theme configuration
  THEME: {
    PRIMARY_COLOR: '#1677ff',
  },
  
  // Loading states text
  LOADING_TEXT: {
    FORM_PROCESSING: 'Обработка...',
    REQUEST_PROCESSING: 'Обработка запроса...',
  },
  
  // Button text
  BUTTON_TEXT: {
    ANALYZE: 'Анализировать профиль',
    RESET: 'Сбросить',
    TRY_AGAIN: 'Попробовать снова',
  },
  
  // Card titles
  CARD_TITLES: {
    PROFILE_ANALYZER: 'Анализ профиля Dota 2 ru',
    RESULTS: 'Результаты',
    ERROR: 'Что-то пошло не так',
  },
  
  // Form labels
  FORM_LABELS: {
    PROFILE_URL: 'URL профиля',
    AI_ANALYSIS: 'AI Анализ:',
  },
  
  // Placeholders
  PLACEHOLDERS: {
    PROFILE_URL: 'Введите URL профиля Dota 2 (https://dota2.ru/forum/members/ten228.785716/)',
  },
};