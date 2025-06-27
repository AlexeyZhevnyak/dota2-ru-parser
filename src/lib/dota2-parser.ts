/**
 * @deprecated This file is deprecated. Use the new service at @/services/dota2-parser.service.ts instead.
 */

import {JSDOM} from 'jsdom';

interface ParsedTopic {
    [title: string]: string;
}

interface TopicData {
    title: string | null;
    content: string | null;
}

const PAGES_TO_SCRAPE = 3;
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

class Dota2Parser {
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, { headers: HEADERS });

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
    }

    private extractUserSegment(userProfileUrl: string): string {
        try {
            const userSegment = userProfileUrl.trim().replace(/\/$/, '').split('/').pop();

            if (!userSegment || !userSegment.includes('.')) {
                throw new Error("Сегмент URL не похож на формат 'имя.id'");
            }

            return userSegment;
        } catch (error) {
            throw new Error(`Не удалось извлечь сегмент пользователя из URL: ${error}`);
        }
    }

    private async getAllTopicLinks(userSegment: string, pagesCount: number): Promise<string[]> {
        const allTopicLinks: string[] = [];
        const baseActivityUrl = `https://dota2.ru/forum/members/${userSegment}/activity/topics/`;

        console.log(`Начинаем сбор ссылок с ${pagesCount} страниц...`);

        for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
            const pageUrl = pageNum === 1
                ? baseActivityUrl
                : `${baseActivityUrl}page-${pageNum}`;

            console.log(`  Сканируем страницу ${pageNum}: ${pageUrl}`);

            try {
                const response = await this.fetchWithRetry(pageUrl);
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
                    const textResponse = await this.fetchWithRetry(pageUrl);
                    htmlContent = await textResponse.text();
                }

                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;

                const topicBlocks = document.querySelectorAll('div.forum-profile__content-block-active-wrap');

                if (topicBlocks.length === 0) {
                    console.log(`  Темы на странице ${pageNum} не найдены. Пробуем следующую страницу.`);
                    continue;
                }

                const baseUrl = 'https://dota2.ru';
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
    }

    private async parseTopicPage(topicUrl: string): Promise<TopicData> {
        try {
            const response = await this.fetchWithRetry(topicUrl);
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
    }

    async parseUserTopics(userProfileUrl: string): Promise<ParsedTopic> {
        console.log(`Получена ссылка на профиль: ${userProfileUrl}`);

        const userSegment = this.extractUserSegment(userProfileUrl);
        console.log(`Найден сегмент пользователя: ${userSegment}`);

        const topicUrls = await this.getAllTopicLinks(userSegment, PAGES_TO_SCRAPE);
        const results: ParsedTopic = {};

        if (topicUrls.length > 0) {
            console.log('\nНачинаем сбор текстов первых сообщений...');

            for (let i = 0; i < topicUrls.length; i++) {
                const url = topicUrls[i];
                console.log(`  Обрабатываем тему ${i + 1}/${topicUrls.length}: ${url}`);

                const { title, content } = await this.parseTopicPage(url);

                if (title && content) {
                    results[title] = content;
                }
            }

            console.log(`\nГотово! Результаты ${Object.keys(results).length} тем готовы к возврату`);
        } else {
            console.log('\nРабота завершена. Не удалось найти ни одной темы для парсинга.');
        }

        return results;
    }
}

export async function parseUserTopics(userProfileUrl: string): Promise<ParsedTopic> {
    const parser = new Dota2Parser();
    return parser.parseUserTopics(userProfileUrl);
}
