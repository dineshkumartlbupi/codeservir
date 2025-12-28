import * as cheerio from 'cheerio';
import axios from 'axios';

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
     * Scrape website content using simple HTTP (Axios + Cheerio)
     * Puppeteer has been removed to reduce bundle size for Vercel serverless functions.
     */
    async scrapeWebsite(url: string): Promise<ScrapedContent[]> {
        try {
            console.log(`🔍 Starting to scrape: ${url}`);

            // Simple scraping logic (fallback to axios/cheerio)
            const content = await this.scrapeSimple(url);

            return [{
                url,
                title: 'Scraped Content',
                content,
                links: []
            }];
        } catch (error) {
            console.error('Web scraping error:', error);
            throw new Error('Failed to scrape website');
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
