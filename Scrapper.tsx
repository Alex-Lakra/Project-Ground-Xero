import puppeteer from 'puppeteer';

export async function scrapeLeetCodeProfile(username: string) {
    const url = `https://leetcode.com/u/${username}/`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        // Adding args to make the scraper look more like a real user to bypass basic bot protections
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a real-looking User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    try {
        // Wait until network activity settles so React has time to render the DOM
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Execute code inside the browser environment to extract DOM elements
        const scrapedData = await page.evaluate(() => {
            const allElements = Array.from(document.querySelectorAll('*'));

            // Easy solved count
            const easyElement = allElements.find(el => el.childNodes.length === 1 && el.textContent?.trim() === 'Easy');
            const easyText = easyElement?.parentElement?.textContent || easyElement?.textContent || '';
            const easyMatch = easyText.replace('Easy', '').match(/\d+/);
            const easy = easyMatch ? easyMatch[0] : '0';

            // Medium solved count
            const mediumElement = allElements.find(el => el.childNodes.length === 1 && (el.textContent?.trim() === 'Medium' || el.textContent?.trim() === 'Med.'));
            const mediumText = mediumElement?.parentElement?.textContent || mediumElement?.textContent || '';
            const mediumMatch = mediumText.replace('Medium', '').replace('Med.', '').match(/\d+/);
            const medium = mediumMatch ? mediumMatch[0] : '0';

            // Hard solved count
            const hardElement = allElements.find(el => el.childNodes.length === 1 && el.textContent?.trim() === 'Hard');
            const hardText = hardElement?.parentElement?.textContent || hardElement?.textContent || '';
            const hardMatch = hardText.replace('Hard', '').match(/\d+/);
            const hard = hardMatch ? hardMatch[0] : '0';

            // 2. Scrape Recent Submissions
            // Recent questions are links pointing to "/submissions/detail/..."
            const links = Array.from(document.querySelectorAll('a[href^="/submissions/detail/"]'));

            const recentSubmissions: string[] = [];
            const seenUrls = new Set<string>();

            for (const link of links) {
                const href = link.getAttribute('href');
                const titleDiv = link.querySelector('[data-title]');
                const title = titleDiv ? titleDiv.getAttribute('data-title') : link.textContent?.split('\n')[0]?.trim();

                if (title && href && !seenUrls.has(href)) {
                    seenUrls.add(href);
                    recentSubmissions.push(title);
                }
            }

            return {
                stats: { easy, medium, hard },
                recent: recentSubmissions.slice(0, 5)
            };
        });

        return scrapedData;

    } catch (error) {
        throw error;
    } finally {
        await browser.close();
    }
}

export async function scrapeCodeforcesProfile(handle: string) {
    try {
        const url = `https://codeforces.com/api/user.status?handle=${handle}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Codeforces API returned status ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== "OK") {
            throw new Error(data.comment || "Failed to fetch Codeforces status");
        }

        const submissions = data.result || [];
        const solvedProblems = new Set<string>();
        const recentSubmissions: string[] = [];
        const seenRecent = new Set<string>();

        for (const sub of submissions) {
            if (sub.verdict === "OK" && sub.problem) {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedProblems.add(problemId);

                if (recentSubmissions.length < 5 && !seenRecent.has(sub.problem.name)) {
                    seenRecent.add(sub.problem.name);
                    recentSubmissions.push(sub.problem.name);
                }
            }
        }

        return {
            stats: {
                solved: solvedProblems.size
            },
            recent: recentSubmissions
        };
    } catch (error: any) {
        throw new Error(`Codeforces fetch failed: ${error.message}`);
    }
}

/**
 * Calculates the timestamp of the latest LeetCode Daily Question release.
 * LeetCode resets its Daily Question at 00:00:00 UTC every day.
 * In Indian Standard Time (IST = UTC + 05:30), 00:00:00 UTC corresponds to 05:30:00 AM IST.
 */
export function getLatestLeetCodeResetTimestamp(now = new Date()): number {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const date = now.getUTCDate();
    // 00:00:00.000 UTC = 05:30:00.000 AM IST
    return Date.UTC(year, month, date, 0, 0, 0, 0);
}

export function isDailyCacheStale(lastFetchedMs: number, now = new Date()): boolean {
    if (!lastFetchedMs) return true;
    const latestResetMs = getLatestLeetCodeResetTimestamp(now);
    return lastFetchedMs < latestResetMs;
}

// Pre-warmed instant cache for LeetCode Daily Question
let cachedDailyQuestion: any = null;
let lastFetchedTimestamp: number = 0;

export async function scrapeLeetCodeDailyQuestion(forceRefresh = false) {
    const now = new Date();
    const isStale = isDailyCacheStale(lastFetchedTimestamp, now);

    // Return cached daily question if fresh and not forced
    if (!forceRefresh && !isStale && cachedDailyQuestion) {
        return cachedDailyQuestion;
    }

    try {
        // Fast Strategy 1: Fetch via public LeetCode daily API endpoint with 3.5s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch('https://alfa-leetcode-api.onrender.com/daily', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            if (data && data.questionTitle) {
                const cleanDesc = (data.question || '')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&amp;/g, '&')
                    .trim();

                const tags = Array.isArray(data.topicTags) 
                    ? data.topicTags.map((t: any) => t.name)
                    : ['Data Structures & Algorithms'];

                cachedDailyQuestion = {
                    questionId: data.questionFrontendId || '3513',
                    title: data.questionTitle,
                    difficulty: data.difficulty || 'Medium',
                    tags: tags.length > 0 ? tags : ['Algorithms'],
                    description: cleanDesc,
                    htmlContent: data.question,
                    link: data.questionLink || 'https://leetcode.com',
                    date: data.date || now.toISOString().split('T')[0],
                    fetchedAt: Date.now(),
                    codeSnippets: {
                        javascript: `// Starter template for ${data.questionTitle}\n// Link: ${data.questionLink || 'https://leetcode.com'}\n\n/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction solve(nums) {\n  // Implement solution here...\n}`,
                        python: `# Starter template for ${data.questionTitle}\nclass Solution:\n    def solve(self, nums: List[int]) -> int:\n        pass`,
                        cpp: `// Starter template for ${data.questionTitle}\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(vector<int>& nums) {\n        return 0;\n    }\n};`
                    }
                };
                lastFetchedTimestamp = Date.now();
                return cachedDailyQuestion;
            }
        }
    } catch (apiErr) {
        console.warn('LeetCode daily scraper fetch error, returning existing cache:', apiErr);
    }

    return cachedDailyQuestion;
}