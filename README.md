# LearnXAI – AI-Powered Personalized Learning & Career Intelligence

LearnXAI is a modern, interactive web application that delivers a personalized learning experience for Java developers. It combines skill assessments, AI-powered tutoring, dynamic gap detection, personalized recommendations, gamified achievement tracking, and structured career roadmaps into a single, polished platform.

> **Note:** This is a prototype. All AI tutor responses are simulated locally — no external AI API is configured. Quiz data, learning resources, and career roadmaps use curated sample content. Progress is stored in the browser via `localStorage`.

---

## Features

### Landing Page & Demo Login
- Modern hero section with animated gradient design
- Feature highlights, "how it works" walkthrough, and career path previews
- One-click demo login (no real credentials required)

### Student Dashboard
- Progress overview cards (assessments taken, average score, total XP, achievements)
- Interactive radar chart showing skill mastery across all concepts
- Category bar chart with color-coded mastery levels
- Gap detection panel highlighting weak concepts
- Recent activity timeline and strong concept tracking
- Quick action cards for navigation to key features

### Java Skill Assessment
- 20 multiple-choice questions across 7 categories:
  - Fundamentals, Object-Oriented Programming, Collections, Exceptions, Concurrency, Modern Java, JVM Internals
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
- Chat-based interface with simulated AI responses
- Pre-built explanations for key Java topics (OOP, exceptions, streams, concurrency, GC, collections)
- Clearly labeled "Demo Response" badges on all AI messages
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
│   │   ├── quizData.ts         # 20 Java quiz questions across 7 categories
│   │   └── content.ts          # Career roadmaps, achievements, learning resources
│   ├── hooks/
│   │   └── useLocalStorage.ts  # Custom hook for browser storage persistence
│   ├── pages/
│   │   ├── LandingPage.tsx     # Marketing page with demo login
│   │   ├── Dashboard.tsx       # Student dashboard with charts and stats
│   │   ├── Assessment.tsx      # Java skill assessment quiz
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
| **AI Tutor** | Responses are generated locally using pattern matching. All messages show a "Demo Response" badge. No external AI API is called. |
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
