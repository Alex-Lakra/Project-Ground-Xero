# Ground_Xero OS — Comprehensive Project Dossier & Architecture Reference

> **Document Purpose**: This comprehensive reference document outlines the entire architecture, core features, UI/UX design philosophy, file hierarchy, component logic, command set, and backend services of **Ground_Xero OS**. It is structured specifically for ingestion by AI language models and human collaborators to facilitate brainstorming, feature expansion, and architectural review.

---

## 1. 📌 Executive Summary & Concept

**Ground_Xero OS** is a web-based, Matrix-themed reality selector and virtual operating system simulator. Grounded in dystopian cyberpunk aesthetics, the application presents users with a fundamental choice between two distinct virtual constructs:

1. **Red Pill Reality (The Mainframe)**: A developer-grade CLI terminal complete with simulated SSH access, live competitive programming scrapers (LeetCode & Codeforces), interactive 2D graph visualizations (`react-force-graph-2d`), Matrix digital rain visualizers (`cmatrix`), user account management with 2FA TOTP authentication, and customizable operator profiles.
2. **Blue Pill Reality (The Cozy Citizen Sector)**: A serene, multi-page citizen portal engineered to maintain psychological stability. Features citizen authentication (`LoginPage`), an interactive top navigation shell (`HeaderNav`), main citizen metrics dashboard (`DashboardView`), cyberpunk learning hub (`CoursesView`), daily coding arena powered by cached LeetCode Daily Questions (`ChallengesView`), syndicate community hubs (`CommunitiesView`), virtual hackathons & events calendar (`EventsView`), detailed citizen profiles (`ProfileView`), and an enterprise/administrator control console (`AdminConsoleView`).

The system is framed by a matrix bootloader handshake animation upon initialization (`MatrixLoader`), seamless glitch-effect screen transitions between realities, scanline CRT overlays, and custom system settings.

---

## 2. 🏗️ Architecture & Technology Stack

| Layer | Technology / Library | Purpose & Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** | High-performance, type-safe client UI application. |
| **Build System** | **Vite 6** + **tsx** + **esbuild** | Fast HMR dev server and single-bundle server compilation. |
| **Styling & Theme** | **Tailwind CSS v4** + **Vanilla CSS** | Matrix palette (`#ff0033` red, `#0070ff` blue, `#e9bcb9` peach, `#121414` dark bg), CRT scanlines, glitched typography, neon glows, and custom typography (`JetBrains Mono`, `Anton`, `Inter`). |
| **Icons & Media** | **Lucide React** + Custom SVG Artwork | Cyberpunk icons (`Terminal`, `Settings`, `Layers`, `Eye`, `RefreshCw`, `Volume2`, `Moon`, `Heart`, etc.) and Morpheus SVG vector artwork. |
| **Graph Visualization** | **react-force-graph-2d** | Interactive 2D force-directed node map canvas (`nodemap`). |
| **Audio Processing** | **Web Audio API** | Real-time low-frequency soundscape generation using lowpass/peaking/notch filters and sine wave oscillators. |
| **Authentication & 2FA**| **qrcode.react** + `firebaseAuth.ts` | TOTP 2FA setup with QR code generation in Red Pill CLI + Citizen auth in Blue Pill portal. |
| **Backend Server** | **Express.js** (Node.js) | Dual API backend serving static Vite SPA + endpoints for scraping LeetCode, Codeforces, and caching LeetCode Daily Questions. |
| **Data Scrapers** | **Fetch API / GraphQL / REST** | Direct LeetCode GraphQL query engine, Codeforces API submission parser, and LeetCode daily challenge scraper. |
| **Database & Persistence**| **Firebase Firestore REST** / `localStorage` | Remote user document syncing with fallback to `localStorage` for offline session persistence. |

---

## 3. 📁 Repository File Structure

```
Project-Ground-Xero/
├── package.json               # Dependencies & scripts (dev, build, start, lint)
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── server.ts                  # Express server entry point & API route handlers
├── Scrapper.tsx               # LeetCode GraphQL, Codeforces REST API & LeetCode Daily scraper
├── index.html                 # Main HTML entry with Google Fonts (Anton, JetBrains Mono, Inter, Space Grotesk)
├── README.md                  # Project overview and quickstart instructions
├── metadata.json              # App metadata
└── src/
    ├── main.tsx               # React root entry point
    ├── App.tsx                # Main App shell, global state router, glitch transition engine
    ├── index.css              # Global CSS styles, Tailwind directives, CRT scanlines, neon glows
    ├── types.ts               # Core TypeScript interfaces (PillChoice, SystemSettings, SSHUser, BluePillUser, etc.)
    ├── assets/
    │   └── morpheus.svg       # Custom vector artwork for Morpheus choice screen
    ├── services/
    │   ├── firebaseDb.ts      # Firebase Firestore REST API wrapper & localStorage fallback DB
    │   └── firebaseAuth.ts    # Blue Pill citizen authentication service
    └── components/
        ├── MatrixLoader.tsx   # Initial zero-white-flash bootloader loading screen
        ├── MorpheusChoice.tsx # The Construct gateway (Morpheus choice card & pills)
        ├── RedPillTerminal.tsx# Mainframe CLI terminal, SSH session, hacking tools, cmatrix
        ├── BluePillConstruct.tsx# Primary container & tab router for Blue Pill citizen portal
        ├── ProfileCard.tsx    # Cyberpunk floating mainframe operator profile drawer
        ├── NodeMapViewer.tsx  # Interactive 2D graph force visualization component
        ├── SettingsPanel.tsx  # System configuration modal drawer (CRT scanlines, font, density)
        ├── TerminalOverlay.tsx# Global quick-command drawer accessible from anywhere
        ├── DigitalRain.tsx    # HTML5 Canvas Katakana matrix digital rain cascade
        └── bluepill/          # Modular Blue Pill Citizen Portal Pages
            ├── HeaderNav.tsx         # Citizen top navigation bar & tab switcher
            ├── LoginPage.tsx         # Citizen authentication & multi-factor onboarding portal
            ├── DashboardView.tsx     # Main citizen dashboard (vitals, progress, community ticker)
            ├── CoursesView.tsx       # Cyberpunk learning hub (courses, filters, mentor profiles)
            ├── ChallengesView.tsx    # Coding arena featuring live cached LeetCode Daily Question
            ├── CommunitiesView.tsx   # Syndicate hubs, hacker groups & discussion forums
            ├── EventsView.tsx        # Virtual hackathons, workshops & countdown calendar
            ├── ProfileView.tsx       # Detailed citizen profile, badges, & activity heatmap
            ├── AdminConsoleView.tsx  # Construct admin console & server load telemetry
            └── EnterpriseDashboard.tsx # Organizational sector overview & cohort metrics
```

---

## 4. 🕶️ Core Pages & Virtual Constructs (Detailed Description)

### 4.1 Matrix Initialization Handshake (`MatrixLoader.tsx`)
- **Trigger**: Displays automatically when launching the application until initial loading is complete (or skipped).
- **Visuals**: Fullscreen Katakana digital rain background overlay, CRT scanlines, glowing peach/red border box, dynamic ASCII progress bar: `[██████████░░░░░░░░░░] XX%`.
- **Functionality**:
  - Simulates sequential mainframe diagnostic logs (e.g., *ESTABLISHING SECURE GATEWAY TUNNEL*, *BYPASSING SENTINEL FIREWALL*, *ALLOCATING NEURAL MEMORY SUBSPACES*).
  - Skips flash of white screen during boot up.
  - Features an explicit `[ Skip Handshake ]` option for immediate access.

---

### 4.2 Make Your Choice — The Construct (`MorpheusChoice.tsx`)
- **Trigger**: Default home screen (`choice === 'none'`).
- **Narrative Intro**: Quote from Morpheus framing the choice: *"This is your last chance. After this, there is no turning back..."*
- **Visual Features**:
  - Displays high-resolution vector artwork of Morpheus holding the Red Pill in his right hand and the Blue Pill in his left.
  - **Interactive Hotspots**: Pulsing neon ring overlays placed directly over Morpheus's hands. Clicking the red pill mounts the Red Pill Terminal; clicking the blue pill launches the Blue Pill Construct.
  - Hovering over either hand triggers glitch-styled text feedback detailing the choice.
- **Brutalist Action Cards**:
  - **Option 01 // RED_PILL ("AWAKEN THE MIND")**: Direct link to the developer CLI mainframe, SSH root access, raw machine truth.
  - **Option 02 // BLUE_PILL ("EMBRACE COMFORT")**: Direct link to the cozy citizen portal, peaceful dream state.

---

### 4.3 Red Pill Terminal — The Mainframe (`RedPillTerminal.tsx`)
- **Trigger**: Selected when choosing `red` pill.
- **Environment**: A raw, retro-futuristic hacker shell equipped with custom state management for local shell, SSH authentication, user profile management, interactive force graphs, and fullscreen digital matrix rain.
- **Tab Modes**:
  1. **Terminal Console View**: Interactive prompt (`root/ $` or `[username@zero] ~ $`) supporting command history (Up/Down arrow keys), autocomplete, ASCII banners, and structured tabular outputs.
  2. **Rain Visualizer View**: Fullscreen `cmatrix` stream with customizable rain density and color choices (Green, Red, Blue, Purple).
- **Core Systems Built-In**:
  - **SSH State Machine**: Connects to `zero` mainframe node (`ssh username@zero`). Enforces password verification, mandatory first-login password reset, TOTP 2FA QR Code generation (`qrcode.react`), and session logout.
  - **Live Profile Scraper Integration**:
    - `leet` / `/leet`: Scrapes LeetCode GraphQL API to retrieve total solved problems broken down by difficulty (Easy, Medium, Hard) and the top 5 recent accepted submissions.
    - `codef` / `/codef`: Scrapes Codeforces REST API to retrieve total solved problems count and recent accepted problem list.
  - **Node Map Integration (`nodemap`)**: Launches an interactive 2D graph viewer showing connected account nodes, project statuses, and live scraped platform metrics.
  - **Operator Profile Customization**: Commands to customize profile (`rename`, `about`, `addstack`, `repo`, `profpic`, `clearstack`) rendered in a floating cyberpunk `ProfileCard`.
  - **Root Administrator Suite**: Provisions, lists, deletes users, and resets 2FA secrets stored in Firebase/localStorage (`createuser`, `listusers`, `deleteuser`, `reset2fa`).

---

### 4.4 Blue Pill Construct — Citizen Portal Ecosystem (`BluePillConstruct.tsx` & `src/components/bluepill/*`)
- **Trigger**: Selected when choosing `blue` pill.
- **Environment**: A serene, multi-page citizen portal engineered for relaxation, learning, community engagement, and mental stability. `BluePillConstruct.tsx` acts as the master container routing through 10 modular sub-views:

#### 1. Header Navigation Shell (`HeaderNav.tsx`)
- Top navigation bar for the Blue Pill construct.
- Displays sector branding, tab switcher (`Dashboard`, `Courses`, `Challenges`, `Communities`, `Events`, `Profile`, `Admin Console`), notification indicators, citizen online badge, and quick authentication logout/login button.

#### 2. Citizen Authentication & Login (`LoginPage.tsx`)
- Matrix citizen authorization portal allowing users to log in or register.
- Features multi-factor security simulation, passkey/biometric UI options, smooth tab transitions between login and sign-up, and session initialization.

#### 3. Citizen Dashboard (`DashboardView.tsx`)
- Master overview of the citizen's virtual life.
- Features cognitive comfort score readout (0-100%), stress metrics, current enrolled courses summary, active challenges highlight, community news ticker, and daily habit recommendations.

#### 4. Cyberpunk Learning Hub (`CoursesView.tsx`)
- Comprehensive educational catalog featuring tech modules (e.g. *Quantum Encryption*, *Neural Network Architecture*, *Matrix Kernel Security*).
- Includes course difficulty tags (Beginner, Intermediate, Advanced), progress bars, topic filters, module breakdowns, and top mentor profile cards with rating badges.

#### 5. Coding Arena & Daily Challenges (`ChallengesView.tsx`)
- Integrates live server-side cached **LeetCode Daily Question** fetched via `scrapeLeetCodeDailyQuestion`.
- Displays problem title, difficulty badge (Easy, Medium, Hard), topic tags, detailed problem description, and starter code templates in **JavaScript**, **Python**, and **C++**.
- Includes an interactive code viewer, copy-to-clipboard trigger, and direct link to LeetCode submission pages.

#### 6. Syndicate Communities & Forums (`CommunitiesView.tsx`)
- Social hub for citizen groups and hacker syndicates (e.g. *Zion Cyberpunk Collective*, *Cipher Security Guild*).
- Displays active member counts, category filters, featured community cards, and live public discussion thread previews.

#### 7. Virtual Gatherings & Events (`EventsView.tsx`)
- Calendar for upcoming cyber events, virtual hackathons, live workshops, and sector webinars.
- Features real-time countdown timers, attendee rosters, speaker bios, and instant RSVP registration buttons.

#### 8. Citizen Profile (`ProfileView.tsx`)
- Detailed profile view displaying earned achievement badges, completed course certificates, cognitive rank level, annual activity contribution heatmap, and account preference toggles.

#### 9. Construct Admin Console (`AdminConsoleView.tsx`)
- High-level system administrator dashboard monitoring construct operations.
- Real-time telemetry monitoring server load, active citizen session counters, memory allocation graphs, security policy overrides, and emergency subsystem controls.

#### 10. Enterprise Dashboard (`EnterpriseDashboard.tsx`)
- Organizational metric visualizer providing sector cohort tracking and high-level enterprise statistics.

---

## 5. 🧩 Interactive Components & Overlays

### 5.1 Mainframe Operator Profile Card (`ProfileCard.tsx`)
- A floating cyberpunk card displaying active operator details.
- Features animated laser scanning beam effect, live uptime clock (`04:12:34`), avatar image with status beacon & radar wave animation, status bubble, technology stack tags (`TS`, `REACT`, `NODE`), pronouns, UID, and role (`SYSADMIN` or `OPERATOR`).
- Includes automatic fallback to an inline SVG Data URI hacker avatar and `referrerPolicy="no-referrer"` handling for Google Drive profile pictures.

### 5.2 Interactive Node Map Viewer (`NodeMapViewer.tsx`)
- Full-screen modal housing a 2D force-directed canvas (`react-force-graph-2d`).
- Visualizes network links between `account`, `projects`, `LeetCode`, and `Codeforces`.
- Clicking nodes zooms in and dynamically expands child nodes (e.g., fetching live LeetCode stats and generating nodes for Easy/Medium/Hard count).

### 5.3 System Configuration Panel (`SettingsPanel.tsx`)
- Slide-over configuration drawer accessible from header (CPU icon).
- Options:
  - CRT Scanline Opacity Slider (0% to 50%).
  - Sub-Code Rain Density Multiplier (0.5x to 2.0x).
  - Enforce Retro Monospace Font (`JetBrains Mono`).
  - Terminal Typing Diagnostic Speed (`fast`, `normal`, `slow`).
  - Emergency *"Terminate Mind State"* reset button.

### 5.4 Global Quick-Command Terminal Overlay (`TerminalOverlay.tsx`)
- Quick-access overlay drawer toggled via terminal icon in top navigation.
- Accepts quick slash commands (e.g. `/help`, `/choice`, `/pill red`, `/pill blue`) from any page.

### 5.5 Digital Rain Component (`DigitalRain.tsx`)
- Canvas-based visual matrix rain animation generating cascading Katakana characters and numbers with dynamic speed, opacity drop-off, and glowing lead characters.

---

## 6. ⚙️ Backend Services & API Integrations

### 6.1 Server & API Architecture (`server.ts` & `Scrapper.tsx`)
The server uses Express.js running on Node.js:

1. **LeetCode Profile Endpoint** (`POST /api/scrape`):
   - Accepts `{ "username": "leetcode_handle" }`.
   - Sends GraphQL POST query to `https://leetcode.com/graphql`.
   - Queries `matchedUser` (`submitStatsGlobal`) and `recentAcSubmissionList` (limit 15).
   - Returns `{ success: true, stats: { easy, medium, hard }, recent: [...] }`.
2. **Codeforces Profile Endpoint** (`POST /api/scrape-codeforces`):
   - Accepts `{ "username": "codeforces_handle" }`.
   - Fetches JSON from `https://codeforces.com/api/user.status?handle={handle}`.
   - Filters submissions by verdict `OK` to calculate unique solved problem count and recent submissions list.
   - Returns `{ success: true, stats: { solved }, recent: [...] }`.
3. **LeetCode Daily Question Endpoint** (`GET /api/leetcode-daily`):
   - Fetches the official LeetCode Daily Question using `scrapeLeetCodeDailyQuestion`.
   - Implements server-side in-memory caching (`cachedDailyQuestion`) reset automatically at 00:00:00 UTC (05:30:00 AM IST) every day.
   - Pre-formats starter code templates in JavaScript, Python, and C++.
4. **Vite SPA Middleware**:
   - In development: Uses `createViteServer` in middleware mode.
   - In production: Serves compiled static bundle from `dist/` directory.

### 6.2 Database & User Repositories (`src/services/firebaseDb.ts` & `firebaseAuth.ts`)
- Connects directly to Google Cloud Firestore REST API endpoint (`https://firestore.googleapis.com/v1/projects/.../documents`).
- Implements fallback to `localStorage` (`ground_xero_ssh_users`) when network connection is offline or unconfigured.
- Stores user accounts (`SSHUser` schema) containing username, password hash, password reset flag, 2FA secret key, display name, bio status bubble, avatar URL, tech stack array, and UID.
- Includes helper `formatImageUrl()` to transform Google Drive share & viewer URLs into direct Google Drive thumbnail streams (`https://drive.google.com/thumbnail?id=<ID>&sz=w500`).
- Includes `DEFAULT_GHOST_AVATAR` defined as an inline SVG Data URI for guaranteed 100% offline and online rendering without CORS errors.

---

## 7. ⌨️ Complete Command Reference List

### 7.1 Local Shell Commands (`RedPillTerminal` — Not Logged In)
| Command | Parameters | Description |
| :--- | :--- | :--- |
| `help` / `?` | None | Lists available local terminal commands. |
| `clear` / `cls` | None | Erases local console output buffer. |
| `ssh` | `<user>@zero` | Initiates SSH session link to specified user on zero node (e.g. `ssh root@zero`). |
| `fastfetch` | None | Displays system info specifications and ASCII logo. |
| `cmatrix` | `[-c red|blue|green|purple]` | Launches full-screen Katakana digital rain stream with optional color. |
| `nodemap` | None | Opens interactive 2D graph visualization of network nodes. |
| `profile` | None | Opens/toggles floating Mainframe Operator Profile card. |
| `rename` | `<new_name>` | Updates operator display name. |
| `about` | `<bio_text>` | Updates status bubble. |
| `addstack` | `<tech>` | Adds a skill tag to tech stack (e.g. `addstack REACT`). |
| `clearstack` | None | Resets tech stack array. |
| `repo` | `<url>` | Sets bio link repository URL. |
| `profpic` | `<url>` | Sets profile avatar image URL (supports Google Drive links). |
| `exit` / `blue` | None | Terminates terminal session and returns to Morpheus Choice screen. |

---

### 7.2 Mainframe SSH Commands (Authenticated Session)
| Command | Parameters | Description |
| :--- | :--- | :--- |
| `help` / `?` | None | Displays authorized mainframe operations. |
| `whoami` | None | Outputs currently active SSH user and role. |
| `passwd` / `resetpassword` | `<new_password>` | Updates password for active user (or root reset for target user). |
| `/leet` | `<leetcode_url_or_handle>` | Configures LeetCode profile handle. |
| `leet` | None | Fetches and displays live LeetCode stats & recent accepted submissions. |
| `/codef` | `<codeforces_handle>` | Configures Codeforces handle. |
| `codef` | None | Fetches and displays live Codeforces stats & recent accepted problems. |
| `nodemap` | None | Opens interactive 2D network node graph. |
| `logout` / `exit` | None | Terminates SSH connection and returns to local shell. |

---

### 7.3 Root Administrative Commands (Root SSH Access Only)
| Command | Parameters | Description |
| :--- | :--- | :--- |
| `createuser` | `<username> <default_password>` | Provisions a new user account in database. |
| `listusers` | None | Renders formatted ASCII table of all registered accounts, roles, & 2FA status. |
| `deleteuser` | `<username>` | Deletes a standard user account from database. |
| `reset2fa` | `<username>` | Resets 2FA secret key and enforcement status for a user. |

---

### 7.4 Global Overlay Commands (`TerminalOverlay`)
| Command | Parameters | Description |
| :--- | :--- | :--- |
| `/help` | None | Displays overlay command list. |
| `/choice` | None | Forces reset to Morpheus Choice screen. |
| `/pill` | `<red|blue>` | Immediately loads Red Pill CLI or Blue Pill Construct. |

---

## 8. 🎨 Design Aesthetics & UI/UX Guidelines

1. **Color Palette**:
   - **Primary Matrix Red**: `#ff0033` (Red Pill, alerts, root terminal highlights)
   - **Primary Matrix Blue**: `#0070ff` (Blue Pill, cozy sector accent, calm status)
   - **Peach / Amber Accent**: `#e9bcb9` / `#ffb4ab` (Matrix loader glowing borders, text highlights)
   - **Deep Background**: `#121414` / `#020303` (Ultra-dark canvas base)
   - **Surface Card**: `#0c0f0f` with `#2b2d2d` borders.
2. **Typography**:
   - Display & Headings: `'Anton', sans-serif` (Bold, uppercase, brutalist headers).
   - Code & Terminals: `'JetBrains Mono', monospace` (Fixed-width).
   - Body & UI: `'Inter', sans-serif` & `'Space Grotesk', sans-serif`.
3. **CRT & Glitch Effects**:
   - Custom SVG/CSS CRT scanline raster line overlay (`.scanline-overlay`).
   - Pulsing neon border accents and glow drop shadows (`glow-peach`, `drop-shadow-[0_0_12px_#ffffff]`).
   - Screen temporal shift glitch overlay with animated pulse during reality switches.

---

## 9. 💡 Potential Brainstorming Axes for Future Expansion

When sharing this project context with another AI or team to generate new ideas, consider focusing on these potential expansion vectors:

1. **Additional Reality Constructs (Yellow Pill / Purple Pill)**:
   - What third construct could exist between total harsh truth (Red) and total comfortable ignorance (Blue)? (e.g. A Cyberpunk Synthwave Radio / Hacker Arcade construct, or a Sentinel Defense Tactical Map).
2. **Gamification & Mainframe Intrusion Minigames**:
   - Memory hex editor hacking mini-game for password cracking during SSH logins.
   - Code decryption puzzles or CTF (Catch The Flag) terminal challenges.
3. **Enhanced Competitive Programming Integration**:
   - Adding GitHub activity heatmaps, CodeChef, or AtCoder scraping.
   - Auto-generating ASCII progress cards for social sharing.
4. **AI Oracle Agent / Morpheus Chat Integration**:
   - Wiring Gemini / LLM backend to Morpheus as an in-terminal AI Oracle that responds in Matrix lore personas.
5. **Multiplayer Zion Node Network**:
   - Real-time WebSocket terminal chat between logged-in operators.
   - Cooperative mainframe hacking node maps.

---
*End of Ground_Xero OS Documentation*
