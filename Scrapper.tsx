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