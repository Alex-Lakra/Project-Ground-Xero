import puppeteer from 'puppeteer';

export async function scrapeLeetCodeProfile(username: string) {
    const url = `https://leetcode.com/u/${username}/`;
    console.log(`Launching headless browser and navigating to ${url}...`);

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
        console.log("Page title:", await page.title());

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

        // Print Results
        console.log(`\n--- Problem Solved Stats for ${username} ---`);
        console.log(`Easy:   ${scrapedData.stats.easy}`);
        console.log(`Medium: ${scrapedData.stats.medium}`);
        console.log(`Hard:   ${scrapedData.stats.hard}`);

        console.log(`\n--- Top Recent Accepted Submissions ---`);
        if (scrapedData.recent.length === 0) {
            console.log("No recent submissions found. (The DOM structure might have changed or profile is private)");
        } else {
            scrapedData.recent.forEach((sub, index) => {
                console.log(`${index + 1}. ${sub}`);
            });
        }

        return scrapedData;

    } catch (error) {
        console.error("An error occurred during scraping:", (error as Error).message);
        throw error;
    } finally {
        await browser.close();
    }
}

// Execute the function (disabled during import)
// const targetUsername = "lee215";
// scrapeLeetCodeProfile(targetUsername);