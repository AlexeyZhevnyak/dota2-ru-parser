/**
 * Dota 2 Parser Service
 * Handles parsing of Dota 2 profiles from dota2.ru
 */

import { JSDOM } from 'jsdom';
import { API_CONFIG } from '@/config';
import { ParsedTopics, TopicData } from '@/types';


/**
 * Fetches a URL with retry logic
 * @param url - URL to fetch
 * @param retries - Number of retries
 * @returns Response object
 */
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers: API_CONFIG.HEADERS });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.log(`Попытка ${i + 1}/${retries} неудачна для ${url}: ${error}`);

      if (i === retries - 1) {
        throw error;
      }
    }
  }

  throw new Error('Все попытки исчерпаны');
};

/**
 * Extracts the user segment from a profile URL
 * @param userProfileUrl - Profile URL
 * @returns User segment in the format 'name.id'
 */
const extractUserSegment = (userProfileUrl: string): string => {
  try {
    const userSegment = userProfileUrl.trim().replace(/\/$/, '').split('/').pop();

    if (!userSegment || !userSegment.includes('.')) {
      throw new Error("Сегмент URL не похож на формат 'имя.id'");
    }

    return userSegment;
  } catch (error) {
    throw new Error(`Не удалось извлечь сегмент пользователя из URL: ${error}`);
  }
};

/**
 * Gets all topic links for a user
 * @param userSegment - User segment
 * @param pagesCount - Number of pages to scrape
 * @returns Array of topic URLs
 */
const getAllTopicLinks = async (userSegment: string, pagesCount: number): Promise<string[]> => {
  const allTopicLinks: string[] = [];
  const baseActivityUrl = `${API_CONFIG.BASE_URLS.DOTA2_RU}/forum/members/${userSegment}/activity/topics/`;

  console.log(`Начинаем сбор ссылок с ${pagesCount} страниц...`);

  for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
    const pageUrl = pageNum === 1
      ? baseActivityUrl
      : `${baseActivityUrl}page-${pageNum}`;

    console.log(`  Сканируем страницу ${pageNum}: ${pageUrl}`);

    try {
      const response = await fetchWithRetry(pageUrl);
      let htmlContent: string;

      try {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          htmlContent = data.content || '';
        } else {
          htmlContent = await response.text();
        }
      } catch (parseError) {
        console.log(`  Ошибка парсинга ответа: ${parseError}. Пробуем как текст.`);
        const textResponse = await fetchWithRetry(pageUrl);
        htmlContent = await textResponse.text();
      }

      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;

      const topicBlocks = document.querySelectorAll('div.forum-profile__content-block-active-wrap');

      if (topicBlocks.length === 0) {
        console.log(`  Темы на странице ${pageNum} не найдены. Пробуем следующую страницу.`);
        continue;
      }

      const baseUrl = API_CONFIG.BASE_URLS.DOTA2_RU;
      let linksFoundOnPage = 0;

      topicBlocks.forEach(block => {
        const linkElement = block.querySelector('p.forum-profile__content-block-active-theme a');

        if (linkElement) {
          const href = linkElement.getAttribute('href');

          if (href) {
            const fullLink = href.startsWith('/') ? `${baseUrl}${href}` : href;
            allTopicLinks.push(fullLink);
            linksFoundOnPage++;
          }
        }
      });

      console.log(`    Найдено ${linksFoundOnPage} ссылок на странице.`);

    } catch (error) {
      console.log(`  Ошибка при доступе к странице ${pageNum}: ${error}. Пропускаем.`);
      continue;
    }
  }

  const uniqueLinks = [...new Set(allTopicLinks)];
  console.log(`\nСбор ссылок завершен. Всего найдено ${uniqueLinks.length} уникальных тем.`);

  return uniqueLinks;
};

/**
 * Parses a topic page
 * @param topicUrl - URL of the topic
 * @returns Topic data with title and content
 */
const parseTopicPage = async (topicUrl: string): Promise<TopicData> => {
  try {
    const response = await fetchWithRetry(topicUrl);
    const htmlContent = await response.text();

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const titleElement = document.querySelector('span#topic-title-global');
    const title = titleElement?.textContent?.trim() || null;

    const contentElement = document.querySelector('blockquote.messageText');
    const content = contentElement?.textContent?.trim() || null;

    if (!title) {
      console.log(`   Не удалось найти заголовок на странице: ${topicUrl}`);
    }

    if (!content) {
      console.log(`   Не удалось найти текст первого сообщения на странице: ${topicUrl}`);
    }

    return { title, content };

  } catch (error) {
    console.log(`   Ошибка при получении страницы темы ${topicUrl}: ${error}`);
    return { title: null, content: null };
  }
};

/**
 * Parses user topics from a profile URL
 * @param userProfileUrl - URL of the user profile
 * @returns Parsed topics
 */
export const parseUserTopics = async (userProfileUrl: string): Promise<ParsedTopics> => {
  console.log(`Получена ссылка на профиль: ${userProfileUrl}`);

  const userSegment = extractUserSegment(userProfileUrl);
  console.log(`Найден сегмент пользователя: ${userSegment}`);

  const topicUrls = await getAllTopicLinks(userSegment, API_CONFIG.PAGES_TO_SCRAPE);
  const results: ParsedTopics = {};

  if (topicUrls.length > 0) {
    console.log('\nНачинаем сбор текстов первых сообщений...');

    for (let i = 0; i < topicUrls.length; i++) {
      const url = topicUrls[i];
      console.log(`  Обрабатываем тему ${i + 1}/${topicUrls.length}: ${url}`);

      const { title, content } = await parseTopicPage(url);

      if (title && content) {
        results[title] = content;
      }
    }

    console.log(`\nГотово! Результаты ${Object.keys(results).length} тем готовы к возврату`);
  } else {
    console.log('\nРабота завершена. Не удалось найти ни одной темы для парсинга.');
  }

  return results;
};