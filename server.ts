import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { scrapeLeetCodeProfile, scrapeCodeforcesProfile } from "./Scrapper.tsx";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
