# 📖 Memory Keeper

**Preserve your family's stories forever through AI-guided conversations**

Memory Keeper is an interactive application that helps capture and preserve grandparents' life memories through thoughtful AI-guided interviews, transforming them into beautiful blog posts for the entire family to cherish.

Built for [ACTA Global Hackathon](https://acta.so/hackathon) - October 4-5, 2025

## ✨ Features

- **AI-Guided Interviews**: Thoughtfully crafted questions that help unlock memories naturally
- **Story Preservation**: Securely store interview responses locally
- **Auto-Generated Blog Posts**: Transform conversations into well-written narratives using AI
- **Beautiful UI**: Warm, nostalgic design with smooth animations
- **Export Functionality**: Download stories as markdown files
- **Story Collection**: View and manage all preserved memories in one place

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd memory-keeper

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: OpenAI Integration

For AI-powered blog post generation (optional - works with mock data by default):

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Create a `.env.local` file in the root directory
3. Add your API key:

```
OPENAI_API_KEY=your_api_key_here
```

**Note**: The app works perfectly without an API key using intelligent mock generation!

## 🎯 How It Works

1. **Start Interview**: Click "Start Preserving Memories" on the homepage
2. **Answer Questions**: Go through 6 thoughtfully crafted questions about life experiences
3. **Generate Story**: The app transforms your answers into a beautiful blog post
4. **View & Share**: Access all stories, download them, or share with family

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 (optional)
- **Markdown**: react-markdown
- **Storage**: LocalStorage (client-side)

## 📂 Project Structure

```
memory-keeper/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── interview/page.tsx       # Interview flow
│   ├── generate/page.tsx        # Blog post generation
│   ├── stories/page.tsx         # Stories collection
│   └── api/generate/route.ts    # Blog generation API
├── public/                      # Static assets
└── tailwind.config.js           # Tailwind configuration
```

## 🎨 Design Philosophy

- **Warm & Nostalgic**: Amber and orange gradients evoke warmth and memory
- **User-Friendly**: Intuitive navigation with clear progress indicators
- **Accessible**: High contrast, readable fonts, and clear button states
- **Responsive**: Works beautifully on desktop, tablet, and mobile

## 🧪 Testing Locally

1. Start the dev server: `npm run dev`
2. Navigate to homepage
3. Click "Start Preserving Memories"
4. Complete the interview with sample answers
5. Generate and view the blog post
6. Check the stories collection page

## 📦 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables

Add to Vercel dashboard (Settings → Environment Variables):
- `OPENAI_API_KEY` (optional)

## 🏆 Hackathon Submission

**Built by**: [Your Name]
**Time**: 24 hours
**Hackathon**: ACTA Global Hackathon
**Date**: October 4-5, 2025

### Why This Project?

Memory Keeper addresses a universal problem: preserving family history before it's lost. Every family has stories worth saving, but many lack an easy way to capture and share them. This app makes it simple, meaningful, and beautiful.

### Key Innovations

1. **Duolingo-like Interview Flow**: Progressive questions with visual feedback
2. **Mock-First Design**: Works without API keys for easy testing
3. **Dual View**: See raw interviews OR generated stories
4. **Local-First**: Privacy-focused with client-side storage

## 📝 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- ACTA for organizing this amazing hackathon
- OpenAI for the GPT API
- Next.js team for the incredible framework
- All the families whose stories inspired this project

---

**Built with ❤️ in 24 hours**
