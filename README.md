# LearnXAI – AI-Powered Personalized Learning & Career Intelligence

LearnXAI is a modern, interactive web application that delivers a personalized learning experience for Java developers. It combines skill assessments, AI-powered tutoring, dynamic gap detection, personalized recommendations, gamified achievement tracking, and structured career roadmaps into a single, polished platform.

> **Note:** This is a prototype. The AI tutor uses Gemini when configured and clearly labels demo responses if Gemini is unavailable. Quiz data, learning resources, and career roadmaps use curated sample content. Learning progress is stored in the browser via `localStorage`. Demo login works without configuration; Google sign-in requires a Supabase project with Google OAuth enabled.

---

## Features

### Landing Page & Demo Login
- Modern hero section with animated gradient design
- Feature highlights, "how it works" walkthrough, and career path previews
- One-click demo login (no real credentials required)
- Google sign-in through Supabase Auth (requires provider configuration)

### Student Dashboard
- Progress overview cards (assessments taken, average score, total XP, achievements)
- Interactive radar chart showing skill mastery across all concepts
- Category bar chart with color-coded mastery levels
- Gap detection panel highlighting weak concepts
- Recent activity timeline and strong concept tracking
- Quick action cards for navigation to key features

### Career Skill Assessments
- Separate multiple-choice assessments for Java, Full-Stack, and AI/ML career roadmaps
- Questions cover Java fundamentals and JVM internals; frontend, React, APIs, and databases; and machine learning, model evaluation, and deep learning
- Immediate answer feedback with explanations after each question
- Progress bar showing quiz completion
- Automatic scoring with percentage and correct/incorrect counts

### Automatic Quiz Scoring & Results
- Detailed results page with score, correct answers, and gap summary
- Question-by-question review with correct answers and explanations
- Weak vs. strong concept breakdown

### Dynamic Gap Detection
- Automatic identification of weak concepts based on quiz performance
- Skill mastery tracking with weighted scoring across multiple attempts
- Visual indicators (red/amber/green) for mastery levels

### Personalized Learning Recommendations
- Priority-ordered study plan based on assessment results
- Curated learning resources (videos, articles, exercises, courses) for each weak concept
- Untested concept detection with prompts to assess them
- AI Tutor call-to-action for additional help

### AI Tutor Interface
- Chat-based interface powered by Gemini Flash
- Conversation context for follow-up questions
- Gemini errors are shown directly; sample answers are only shown when explicitly requested
- Suggested questions tailored to the user's weak concepts
- Typing animation for realistic interaction feel

### Career Roadmaps
- Three structured career paths:
  - **Java Developer** – Core Java → Advanced Java → Spring Boot → Enterprise & Deployment
  - **Full-Stack Developer** – Frontend Foundations → Modern Frontend → Backend & Databases → DevOps & Production
  - **AI/ML Engineer** – Math & Python → Machine Learning Core → Deep Learning → LLMs & MLOps
- Expandable phase details with topics, duration, and milestone projects
- Skills list, difficulty level, estimated time, and average salary information

### Skill Wallet
- XP and level system with progress bar
- 8 unlockable achievements (First Steps, Perfectionist, High Scorer, Persistent Learner, Roadmap Explorer, Curious Mind, Concept Master, Level Up)
- Skill portfolio with mastery percentages and color-coded badges
- Concept mastery breakdown (Mastered / In Progress / Needs Focus)

### Design
- **Color theme:** Indigo, cyan, and white with gradient accents
- **Typography:** Inter font family for clean, modern readability
- **Layout:** Sidebar navigation with responsive mobile menu
- **Charts:** Radar chart, bar chart, and progress rings (powered by Recharts)
- **Animations:** Hover states, transitions, typing indicators, and smooth scrolling
- **Responsive:** Fully functional on desktop, tablet, and mobile devices

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | Frontend UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization (radar, bar charts) |
| **Lucide React** | Icon library |
| **Google Gemini** | AI tutor responses (server-side API key) |
| **localStorage** | Browser-based progress persistence |

---

## Project Structure

```
LearnXAI/
├── public/
├── src/
│   ├── components/
│   │   ├── Charts.tsx          # Radar, bar charts, and progress ring
│   │   ├── Sidebar.tsx         # Navigation sidebar with mobile menu
│   │   └── ui.tsx              # Reusable Card, Badge, ProgressBar, PageHeader
│   ├── context/
│   │   └── AppContext.tsx      # Global state (user, attempts, achievements, skills)
│   ├── data/
│   │   ├── quizData.ts         # Java quiz questions
│   │   ├── quizTracks.ts       # Career-specific Java, Full-Stack, and AI/ML assessments
│   │   └── content.ts          # Career roadmaps, achievements, learning resources
│   ├── hooks/
│   │   └── useLocalStorage.ts  # Custom hook for browser storage persistence
│   ├── pages/
│   │   ├── LandingPage.tsx     # Marketing page with demo login
│   │   ├── Dashboard.tsx       # Student dashboard with charts and stats
│   │   ├── Assessment.tsx      # Career-specific skill assessment quiz
│   │   ├── Recommendations.tsx # Personalized study plan
│   │   ├── AITutor.tsx         # Chat-based AI tutor (demo mode)
│   │   ├── Roadmaps.tsx        # Career path roadmaps
│   │   └── SkillWallet.tsx     # Achievements and skill portfolio
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind directives and custom styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/LearnXAI.git
cd LearnXAI

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open the app
# Navigate to http://localhost:5173 in your browser
```

### Configure Google Sign-In

1. Create a Supabase project and enable the **Google** provider under **Authentication → Providers**. Add the OAuth client ID and secret from your Google Cloud OAuth client.
2. In Google Cloud, set the authorized redirect URI to `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase **Authentication → URL Configuration**, add your app URL (for local development, `http://localhost:5173`) to the allowed redirect URLs.
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings.
5. Restart the Vite development server.

The Supabase anon key is intended for use in a frontend app; never put a Supabase service-role key in `VITE_` variables. Google sign-in remains unavailable until these settings are in place, while demo login continues to work.

### Configure Gemini AI Tutor

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. Set `GEMINI_API_KEY` in `.env.local` (copy `.env.example` if needed). Do not prefix it with `VITE_` or expose it in frontend code.
3. Run `npm run dev`. The command starts both the Vite frontend and the API server.
4. For production, build the frontend with `npm run build`, set `GEMINI_API_KEY` in the server environment, and run `npm start`. The Node server serves the built frontend and tutor API.

The tutor API limits requests to 20 per minute per IP. Gemini usage may incur charges under your Google AI Studio account.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

---

## Screenshots

> Add your screenshots here after running the project.

![Landing Page](screenshots/landing.png)
*Modern landing page with hero section and feature highlights*

![Dashboard](screenshots/dashboard.png)
*Student dashboard with progress cards, radar chart, and gap detection*

![Assessment](screenshots/assessment.png)
*Interactive quiz with immediate feedback and explanations*

![Results](screenshots/results.png)
*Detailed results with score, gap analysis, and question review*

![Recommendations](screenshots/recommendations.png)
*Personalized study plan with curated learning resources*

![AI Tutor](screenshots/tutor.png)
*Chat-based AI tutor with demo responses*

![Career Roadmaps](screenshots/roadmaps.png)
*Structured career paths for Java, Full-Stack, and AI/ML*

![Skill Wallet](screenshots/wallet.png)
*Achievements, XP, and skill mastery portfolio*

---

## Simulated Functionality

The following features use sample data or simulated logic and are clearly labeled in the UI:

| Feature | Simulation Details |
|---|---|
| **AI Tutor** | Responses use the server-side Gemini API. Sample answers are an optional fallback and are clearly labeled. |
| **Login/Signup** | Demo mode — any email and password work. No real authentication backend. |
| **Quiz Data** | 20 pre-written Java questions with fixed correct answers and explanations. |
| **Learning Resources** | Curated links to external resources. Some URLs point to official docs (Oracle), others are placeholders. |
| **Career Roadmaps** | Pre-defined structured paths with sample timelines and milestones. |
| **Progress Storage** | All data persists in the browser's `localStorage`. Clearing browser data resets progress. |

---

## GitHub Repository Setup

### Option A: Create via GitHub Website

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `LearnXAI`
3. Description: `AI-Powered Personalized Learning & Career Intelligence`
4. Set to **Public** (or Private if preferred)
5. Do **not** initialize with README, .gitignore, or license (this project includes them)
6. Click **Create repository**

Then push the code:

```bash
git init
git add .
git commit -m "Initial commit: LearnXAI – AI-Powered Personalized Learning & Career Intelligence"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/LearnXAI.git
git push -u origin main
```

### Option B: Upload via GitHub Web Interface

1. Create an empty repository on GitHub (as above)
2. Download all project files as a ZIP
3. On the GitHub repository page, click **uploading an existing file**
4. Drag and drop all files (excluding `node_modules/` and `dist/`)
5. Add a commit message and click **Commit changes**

---

## Deployment

This is a static React app that can be deployed to any static hosting service:

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --build
```

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to GitHub Pages
```

---

## License

This project is created for educational and demonstration purposes. Feel free to use and modify it.

---

## Acknowledgments

- Quiz questions and explanations are curated for educational purposes
- Career roadmaps are inspired by industry-standard learning paths
- Design uses the Inter font (Google Fonts) and Lucide icon set
