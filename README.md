# 🏆 DebugDuel

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.8.3-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A competitive debugging platform where frontend developers race to fix real HTML, CSS, JavaScript, and React bugs. Level up. Rank up. Win.

<div align="center">
  <img src="https://i.imgur.com/debugduel-banner.gif" alt="DebugDuel Banner" width="800"/>
</div>

## ✨ Features

<div align="center">
  <img src="https://img.shields.io/badge/🎯%20Practice%20Mode-Real%20frontend%20bugs-brightgreen" alt="Practice Mode">
  <img src="https://img.shields.io/badge/📅%20Daily%20Challenges-New%20challenge%20every%20day-blue" alt="Daily Challenges">
  <img src="https://img.shields.io/badge/⚔️%201v1%20Live%20Matches-Real-time%20competitive%20debugging-purple" alt="1v1 Live Matches">
  <img src="https://img.shields.io/badge/🏆%20Leaderboard-Global%20%26%20weekly%20rankings-orange" alt="Leaderboard">
</div>

### 🎮 Core Gameplay

- **Practice Mode**: Solve real-world frontend bugs across HTML, CSS, JavaScript, and React with instant feedback
- **Daily Challenges**: Fresh challenge every 24 hours to keep your skills sharp and earn bonus XP
- **1v1 Live Matches**: Real-time competitive debugging powered by Ably with Elo-based matchmaking
- **Tournament Mode**: Compete in timed events for special rewards and recognition
- **Practice Streaks**: Maintain daily practice streaks for bonus rewards and profile badges

### 📈 Progression System

- **8-Tier Rank System**: Progress from Intern → Junior Developer → Senior Developer → Lead Developer → Staff Engineer → Principal Engineer → Distinguished Engineer → Architect
- **XP & Leveling**: Earn XP from challenges, matches, and streaks to level up your profile
- **Elo Rating System**: Competitive matchmaking rating that adjusts based on performance
- **Achievement Badges**: Unlock special badges for milestones, streaks, and category mastery
- **Activity Heatmap**: Visualize your coding consistency with GitHub-style contribution graphs

### 👥 Community & Social

- **Global Leaderboards**: See how you rank against developers worldwide
- **Weekly Tournaments**: Compete in scheduled events for exclusive rewards
- **Friend Challenges**: Challenge specific friends to private debugging duels
- **Team Mode**: Form teams and compete in group competitions
- **Discord Integration**: Connect your Discord for notifications and community features

### 💻 Developer Experience

- **Monaco Editor**: Professional-grade code editor with syntax highlighting, IntelliSense, and themes
- **Instant Validation**: Real-time test feedback as you type
- **Hint System**: Contextual hints when you're stuck (costs XP but prevents frustration)
- **Replay System**: Watch your debugging process or learn from others' approaches
- **Solution Analysis**: See optimal solutions and learn best practices after completing challenges

## 🛠️ Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,mongodb,nextauth,ably,monaco,recharts,zustand,sonner&lucidereact" />
</div>

### Frontend
- **Next.js 13** (App Router) - React framework for production
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide Icons** - Clean, consistent icon set

### Backend & Infrastructure
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** with **Mongoose** - Flexible document database
- **NextAuth.js** - Authentication (Google OAuth, Credentials)
- **Ably** - Real-time messaging for live matches
- **Zustand** - Lightweight state management

### Developer Tools
- **Monaco Editor** - Same editor powering VS Code
- **Recharts** - Data visualization for charts and graphs
- **Sonner** - Toast notifications system
- **Canvas Confetti** - Celebration animations
- **ESLint** - Code quality and consistency

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (free tier works)
- Google Cloud project (for OAuth)
- Ably account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/debugduel.git
cd debugduel
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env.local` in the root directory:
```env
MONGODB_URI=mongodb+srv://your-connection-string
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAIL=admin@example.com
ABLY_API_KEY=your-ably-api-key
```

4. **Seed the database** (optional but recommended)
```bash
node scripts/seedChallenges.js
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

### 🌱 Database Seeding

The seed script populates your database with 30 professionally crafted challenges:
- HTML/CSS layout bugs
- JavaScript logic errors
- React hooks and state management issues
- Accessibility violations
- Performance anti-patterns

Run anytime to refresh challenges:
```bash
node scripts/seedChallenges.js
```
*Note: Script is idempotent - safe to run multiple times*

## 📊 Database Schema

<div align="center">
  <img src="https://i.imgur.com/debugduel-schema.png" alt="Database Schema" width="600"/>
</div>

### User
- `username` (unique, required)
- `email` (unique, required)
- `avatar` (URL)
- `rank` (Intern → Architect, 8 tiers)
- `xp` (experience points)
- `level` (calculated from XP)
- `rating` (Elo rating for matchmaking)
- `wins`, `losses`, `streak`
- `createdAt`, `lastActive`
- `preferences` (theme, notifications, etc.)

### Challenge
- `title`, `description`
- `category` (html, css, javascript, react)
- `difficulty` (easy, medium, hard)
- `starterCode` (what user sees)
- `solutionCode` (securely stored, never exposed)
- `validationTests` (test cases)
- `hints` (progressive hint system)
- `tags` (specific concepts tested)
- `isActive`, `playCount`, `passRate`, `avgSolveTime`

### Submission
- `userId`, `challengeId`
- `code` (submitted solution)
- `passed` (boolean)
- `score` (0-100 based on correctness & efficiency)
- `timeTaken` (in seconds)
- `testResults` (detailed test output)
- `createdAt`

### Matchmaking & Matches
- Real-time queues with Elo-based matching
- Best-of-3 format for fairness
- Anti-cheating measures (solution obfuscation)
- Spectator mode for learning
- Post-match analysis and replay

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `ABLY_API_KEY`
4. Deploy with one click!

### Docker Deployment

```bash
# Build image
docker build -t debugduel .

# Run container
docker run -p 3000:3000 --env-file .env.local debugduel
```

### Manual Server Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Security

- **Zero Knowledge**: Solution code never sent to client
- **Protected Routes**: All API endpoints validate authentication
- **Rate Limiting**: Prevents brute-force attacks on auth endpoints
- **Input Sanitization**: All user inputs validated and sanitized
- **Secure Headers**: Helmet.js equivalent protection via Next.js
- **Environment Protection**: Critical keys only in server environment

## 📱 Responsive Design

DebugDuel works seamlessly across devices:
- **Desktop**: Full-featured editor with split-screen views
- **Tablet**: Optimized layout for touch interfaces
- **Mobile**: Challenge browsing and profile viewing (editor limited)

## 🎨 Customization

### Theming
Modify `app/globals.css` for color scheme changes:
```css
/* Primary theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 0 0% 100%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
}
```

### Components
Extend or override shadcn/ui components in `components/ui/`

### Animations
Custom animations in `components/shared/`:
- `XPAnimation.js` - Celebratory XP gains
- `RankUpCelebration.js` - Rank advancement fireworks
- `ServiceWorkerRegister.js` - PWA offline support

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Follow ESLint configuration
- Use TypeScript for new components
- Keep components small and focused
- Write meaningful commit messages
- Add tests for new functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Ably](https://ably.com/) for real-time infrastructure
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Next.js](https://nextjs.org/) team for the amazing framework
- All contributors who help improve DebugDuel

---

<div align="center">
  <p>Made with ❤️ for developers who love to debug</p>
  <p>
    <a href="https://debugduel.com">Try it live</a> ·
    <a href="https://github.com/yourusername/debugduel">GitHub</a> ·
    <a href="https://discord.gg/debugduel">Discord Community</a>
  </p>
</div>

<!-- Analytics -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/debugduel-%23000000.svg?&style=for-the-badge&logo=debugduel&logoColor=white">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/debugduel-%23ffffff.svg?&style=for-the-badge&logo=debugduel&logoColor=black">
  <img alt="debugduel" src="https://img.shields.io/badge/debugduel-%23000000.svg?&style=for-the-badge&logo=debugduel&logoColor=white">
</picture>