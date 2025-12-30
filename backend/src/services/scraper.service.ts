import * as cheerio from 'cheerio';
import axios from 'axios';
// Puppeteer will be imported dynamically to avoid serverless cold start/size issues


export interface ScrapedContent {
    url: string;
    title: string;
    content: string;
    links: string[];
}

export class WebScraperService {
    private timeout: number;
    private maxPages: number;

    constructor() {
        this.timeout = parseInt(process.env.SCRAPING_TIMEOUT || '30000');
        this.maxPages = parseInt(process.env.MAX_PAGES_TO_SCRAPE || '10');
    }

    /**
     * Scrape website content using Puppeteer for dynamic content
     */
    /**
     * Scrape website content using Puppeteer for dynamic content
     */
    async scrapeWebsite(url: string): Promise<ScrapedContent[]> {
        try {
            console.log(`🔍 Starting to scrape: ${url}`);

            // Bypass Puppeteer entirely to fix Vercel deployment
            // console.warn('⚠️ Puppeteer disabled for Vercel stability. Using simple scraping.');

            const simpleContent = await this.scrapeSimple(url);
            return [{
                url,
                title: 'Scraped Content',
                content: simpleContent,
                links: []
            }];

        } catch (error) {
            console.error('Web scraping error:', error);
            // Don't throw, just return empty to prevent creating chatbot failure
            return [{
                url,
                title: 'Failed to scrape',
                content: '',
                links: []
            }];
        }
    }

    /**
     * Scrape a single page
     */
    private async scrapePage(browser: any, url: string): Promise<ScrapedContent | null> {
        const page = await browser.newPage();

        try {
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            );

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: this.timeout,
            });

            const html = await page.content();
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script, style, nav, footer, header, iframe, noscript').remove();

            // Extract title
            const title = $('title').text() || $('h1').first().text() || '';

            // Extract main content
            const contentSelectors = [
                'main',
                'article',
                '[role="main"]',
                '.content',
                '#content',
                '.main-content',
                'body',
            ];

            let content = '';
            for (const selector of contentSelectors) {
                const element = $(selector);
                if (element.length > 0) {
                    content = element.text();
                    break;
                }
            }

            // Clean up content
            content = content
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, '\n')
                .trim();

            // Extract links
            const links: string[] = [];
            $('a[href]').each((_, element) => {
                const href = $(element).attr('href');
                if (href) {
                    try {
                        const absoluteUrl = new URL(href, url).href;
                        links.push(absoluteUrl);
                    } catch {
                        // Invalid URL, skip
                    }
                }
            });

            await page.close();

            return {
                url,
                title,
                content: content.substring(0, 10000), // Limit content length
                links: [...new Set(links)], // Remove duplicates
            };
        } catch (error) {
            console.error(`Error scraping page ${url}:`, error);
            await page.close();
            return null;
        }
    }

    /**
     * Fallback: Simple HTTP scraping for static content
     */
    async scrapeSimple(url: string): Promise<string> {
        try {
            const response = await axios.get(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
            });

            const $ = cheerio.load(response.data);
            $('script, style, nav, footer, header, iframe, noscript').remove();

            const content = $('body').text()
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, '\n')
                .trim();

            return content.substring(0, 10000);
        } catch (error) {
            console.error('Simple scraping error:', error);
            throw new Error('Failed to scrape website content');
        }
    }

    /**
     * Extract specific sections from scraped content
     */
    extractSections(content: string): { [key: string]: string } {
        const sections: { [key: string]: string } = {};

        // Simple keyword-based section extraction
        const keywords = {
            about: ['about us', 'about', 'who we are', 'our story'],
            services: ['services', 'what we do', 'offerings', 'solutions'],
            products: ['products', 'our products', 'catalog'],
            contact: ['contact', 'reach us', 'get in touch'],
            faq: ['faq', 'frequently asked questions', 'questions'],
        };

        const lowerContent = content.toLowerCase();

        Object.entries(keywords).forEach(([section, terms]) => {
            for (const term of terms) {
                const index = lowerContent.indexOf(term);
                if (index !== -1) {
                    // Extract content around the keyword
                    const start = Math.max(0, index - 100);
                    const end = Math.min(content.length, index + 1000);
                    sections[section] = content.substring(start, end);
                    break;
                }
            }
        });

        return sections;
    }
}

export default new WebScraperService();
