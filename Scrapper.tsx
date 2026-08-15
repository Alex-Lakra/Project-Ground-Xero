export async function scrapeLeetCodeProfile(username: string) {
    const query = `
        query getUserLeetCodeData($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          recentAcSubmissionList(username: $username, limit: 15) {
            title
            titleSlug
            timestamp
          }
        }
    `;

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                "Referer": "https://leetcode.com"
            },
            body: JSON.stringify({
                query,
                variables: { username }
            }),
            signal: AbortSignal.timeout(6000)
        });

        if (!response.ok) {
            throw new Error(`LeetCode GraphQL HTTP Error ${response.status}`);
        }

        const json = await response.json();
        if (json.errors && json.errors.length > 0) {
            throw new Error(json.errors[0].message || "LeetCode GraphQL error");
        }

        if (!json.data || !json.data.matchedUser) {
            throw new Error(`User account "${username}" not found on LeetCode.`);
        }

        const acSubmissions = json.data.matchedUser.submitStats?.acSubmissionNum || [];
        let easy = "0";
        let medium = "0";
        let hard = "0";

        for (const item of acSubmissions) {
            if (item.difficulty === "Easy") easy = String(item.count);
            if (item.difficulty === "Medium") medium = String(item.count);
            if (item.difficulty === "Hard") hard = String(item.count);
        }

        const rawRecent = json.data.recentAcSubmissionList || [];
        const recentSubmissions: string[] = [];
        const seenTitles = new Set<string>();

        for (const item of rawRecent) {
            if (item.title && !seenTitles.has(item.title)) {
                seenTitles.add(item.title);
                recentSubmissions.push(item.title);
            }
        }

        return {
            stats: { easy, medium, hard },
            recent: recentSubmissions.slice(0, 5)
        };
    } catch (error: any) {
        throw new Error(`LeetCode fetch failed: ${error.message}`);
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

export interface Contest {
  id: string;
  title: string;
  platform: 'LeetCode' | 'Codeforces';
  url: string;
  startTimeMs: number;
  startTimeFormatted: string;
  duration: string;
  status: 'UPCOMING' | 'LIVE';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Div. 2' | 'Div. 1';
  xpReward: string;
}

let cachedContests: Contest[] = [];
let lastContestFetchMs = 0;

export async function scrapeUpcomingContests(forceRefresh = false): Promise<Contest[]> {
  const nowMs = Date.now();
  // Return cached contest data if fetched within 5 minutes
  if (!forceRefresh && cachedContests.length > 0 && nowMs - lastContestFetchMs < 300000) {
    return cachedContests;
  }

  const contests: Contest[] = [];

  // 1. Fetch Codeforces Contests
  try {
    const cfRes = await fetch('https://codeforces.com/api/contest.list?gym=false', {
      signal: AbortSignal.timeout(4000)
    });
    if (cfRes.ok) {
      const cfData = await cfRes.json();
      if (cfData.status === 'OK' && Array.isArray(cfData.result)) {
        const upcomingCf = cfData.result
          .filter((c: any) => c.phase === 'BEFORE' || c.phase === 'CODING')
          .slice(0, 4);
          
        for (const c of upcomingCf) {
          const startTimeMs = c.startTimeSeconds * 1000;
          const durationHours = (c.durationSeconds / 3600).toFixed(1);
          contests.push({
            id: `cf-${c.id}`,
            title: c.name,
            platform: 'Codeforces',
            url: `https://codeforces.com/contest/${c.id}`,
            startTimeMs,
            startTimeFormatted: new Date(startTimeMs).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            duration: `${durationHours}h`,
            status: c.phase === 'CODING' ? 'LIVE' : 'UPCOMING',
            difficulty: c.name.includes('Div. 1') ? 'Hard' : 'Medium',
            xpReward: c.phase === 'CODING' ? '+1500 XP' : '+800 XP',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Codeforces contest fetch warning:', err);
  }

  // 2. Fetch LeetCode Contests
  try {
    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        query: `{ topTwoContests { title titleSlug startTime duration cardImg } }`,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (lcRes.ok) {
      const lcData = await lcRes.json();
      const topContests = lcData.data?.topTwoContests || [];
      for (const c of topContests) {
        const startTimeMs = c.startTime * 1000;
        const durationMins = Math.round(c.duration / 60);
        const isLive = Date.now() >= startTimeMs && Date.now() <= startTimeMs + c.duration * 1000;
        contests.push({
          id: `lc-${c.titleSlug}`,
          title: c.title,
          platform: 'LeetCode',
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          startTimeMs,
          startTimeFormatted: new Date(startTimeMs).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: `${durationMins}m`,
          status: isLive ? 'LIVE' : 'UPCOMING',
          difficulty: c.title.includes('Biweekly') ? 'Medium' : 'Hard',
          xpReward: '+1000 XP',
        });
      }
    }
  } catch (err) {
    console.warn('LeetCode contest fetch warning:', err);
  }

  // Fallback defaults if APIs are offline or rate-limited
  if (contests.length === 0) {
    contests.push(
      {
        id: 'lc-weekly-515',
        title: 'LeetCode Weekly Contest 515',
        platform: 'LeetCode',
        url: 'https://leetcode.com/contest/',
        startTimeMs: Date.now() + 86400000,
        startTimeFormatted: 'Sun 8:00 AM',
        duration: '90m',
        status: 'UPCOMING',
        difficulty: 'Hard',
        xpReward: '+1000 XP',
      },
      {
        id: 'cf-round-980',
        title: 'Codeforces Round 980 (Div. 2)',
        platform: 'Codeforces',
        url: 'https://codeforces.com/contests',
        startTimeMs: Date.now() + 172800000,
        startTimeFormatted: 'Mon 8:05 PM',
        duration: '2.0h',
        status: 'UPCOMING',
        difficulty: 'Medium',
        xpReward: '+800 XP',
      }
    );
  }

  cachedContests = contests;
  lastContestFetchMs = Date.now();
  return contests;
}

