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