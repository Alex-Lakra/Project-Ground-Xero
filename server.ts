import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { scrapeLeetCodeProfile, scrapeCodeforcesProfile, scrapeLeetCodeDailyQuestion } from "./Scrapper.tsx";

dotenv.config();

const currentDirname = typeof process !== 'undefined' && process.cwd ? process.cwd() : path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/leetcode-daily", async (req, res) => {
    try {
      const force = req.query.force === 'true';
      const data = await scrapeLeetCodeDailyQuestion(force);
      return res.json({ success: true, question: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to scrape LeetCode daily question" });
    }
  });

  app.post("/api/scrape", async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    try {
      const data = await scrapeLeetCodeProfile(username);
      return res.json({ success: true, stats: data.stats, recent: data.recent });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to scrape LeetCode profile" });
    }
  });

  app.post("/api/scrape-codeforces", async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username/handle is required" });
    }
    try {
      const data = await scrapeCodeforcesProfile(username);
      return res.json({ success: true, stats: data.stats, recent: data.recent });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to scrape Codeforces profile" });
    }
  });

  app.get("/api/scrape-playlist", async (req, res) => {
    const listId = (req.query.list as string) || "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz";
    try {
      const { exec } = await import("child_process");
      const scriptPath = path.join(currentDirname, "scripts", "scrape_youtube_playlist.py");
      exec(`python3 "${scriptPath}" "${listId}"`, (error, stdout, stderr) => {
        if (error) {
          console.warn("[Playlist Scraper API] Exec error:", error.message);
          return res.status(500).json({ error: error.message, stderr });
        }
        return res.json({ success: true, message: "Playlist successfully scraped and synchronized to database!", output: stdout });
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to execute playlist scraper" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
