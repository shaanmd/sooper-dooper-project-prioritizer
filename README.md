# 🎯 Sooper Dooper Project Prioritizer

**Stop guessing which project to build. Start shipping winners.**

An AI-powered tool that helps entrepreneurs and makers prioritize their project ideas using market research, bubble chart visualization, and interactive ranking.

Built in 72 hours for the AI Hackathon (March 7-9, 2026).

---

## 🚀 Live Demo

**Try it now:**
- **Main App:** [sooper-dooper-project-prioritizer.vercel.app](https://sooper-dooper-project-prioritizer.vercel.app)
- **Whimsical Version:** [/machine](https://sooper-dooper-project-prioritizer.vercel.app/machine)
- **Demo Video:** [Coming soon]

---

## 🎬 The Problem

Every entrepreneur has the same challenge: **too many ideas, not enough time.**

We start 10 projects and finish... well, let's not talk about that. The real problem isn't execution—it's picking the **wrong thing** to execute on.

Most founders choose projects based on:
- ❌ Excitement (which fades)
- ❌ Gut feeling (which is often wrong)
- ❌ Whatever sounds cool today

**What if you could make data-driven decisions instead?**

---

## 💡 The Solution

The Sooper Dooper Project Prioritizer uses AI to analyze your project ideas and visualizes them on an interactive bubble chart, showing you **exactly** which projects are worth your time.

### How It Works

1. **📝 Add Your Ideas** - List all your project concepts with passion levels, goals, and constraints
2. **🤖 AI Research** - Claude analyzes market demand, competitors, costs, timeline, and revenue potential
3. **📊 Visual Comparison** - Interactive bubble chart plots projects by value vs. effort
4. **🏆 Find Winners** - Top-right quadrant = high value, low effort = **build these first**

---

## ✨ Key Features

### AI-Powered Market Research
- Automatic competitor analysis
- Revenue estimates (min/max/suggested pricing)
- Build cost calculations (initial + monthly)
- Timeline projections
- Market demand scoring (1-10)
- Required skills assessment

### Interactive Bubble Chart
- **Quadrant Analysis:**
  - 🌟 **The Dream** (top-left): High value, low effort → Winners!
  - ⚡ **The Commitment** (top-right): High value, high effort → Worth it if you commit
  - 📝 **The Distraction** (bottom-left): Low value, low effort → Fill-in work
  - ⚠️ **The Trap** (bottom-right): Low value, high effort → Avoid!

- **Real-Time Ranking:**
  - Adjustable sliders: profit vs. learning priority
  - Risk tolerance settings (low/medium/high)
  - Passion threshold filter
  - Instant recalculation as you adjust

- **Visual Enhancements:**
  - Bubble size = estimated year-1 profit
  - Bubble color = passion level
  - Winner indicator (🏆)
  - Smooth animations

### Project Management
- Track multiple project ideas
- Progress tracking (% completion)
- Goal alignment scoring
- Learning objectives
- Constraint documentation

### Whimsical Machine Landing
Because serious analysis doesn't have to be boring! Our alternative landing page shows the AI "sorting machine" with a cute robot brain and visual flow.

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts (bubble chart visualization)

**Backend & Data:**
- Supabase (PostgreSQL database)
- Next.js API Routes
- Claude API (Anthropic) for AI research

**Deployment:**
- Vercel (auto-deploy from GitHub)

**Key Libraries:**
- @anthropic-ai/sdk
- @supabase/supabase-js
- recharts

---

## 📊 Database Schema

### Tables

**projects**
- Project metadata (name, description, passion level, goal alignment)
- Progress tracking (is_started, completion_percentage)
- Learning goals and constraints

**ai_research**
- AI-generated market insights per project
- Demand scores, competitor data
- Revenue estimates and pricing
- Build costs and timeline
- Audience and accessibility scores

**calculated_metrics**
- Derived scoring (value_score, effort_score)
- Net profit calculations
- Final rankings

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shaanmd/sooper-dooper-project-prioritizer.git
cd sooper-dooper-project-prioritizer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. **Set up Supabase database**

Run the schema migrations in `/supabase/migrations/` (if provided) or create tables manually:
- `projects`
- `ai_research`
- `calculated_metrics`

Enable Row Level Security (RLS) and create policies as needed.

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Optional: Add Demo Data

Import the 5 demo projects with pre-populated AI research for testing:
- Hashtato (Instagram caption generator)
- Dr. Robot DVM (AI pet diagnosis)
- Procrastination Interceptor (browser extension)
- Karen-as-a-Service (complaint letter writer)
- VetRoute (mobile vet route optimizer)

---

## 📁 Project Structure

```
sooper-dooper-project-prioritizer/
├── app/
│   ├── page.tsx                      # Main landing page
│   ├── machine/page.tsx              # Whimsical machine landing
│   ├── dashboard/
│   │   ├── page.tsx                 # Project list
│   │   ├── new/page.tsx             # Create project
│   │   ├── edit/[id]/page.tsx       # Edit project
│   │   ├── [id]/page.tsx            # Project detail + AI research
│   │   └── compare/page.tsx         # Bubble chart comparison
│   └── api/
│       ├── projects/route.ts        # CRUD operations
│       └── research/route.ts        # AI research endpoint
├── components/
│   ├── BubbleChart.tsx              # Interactive bubble chart
│   └── ProjectForm.tsx              # Create/edit form
├── lib/
│   └── supabase.ts                  # Database client
└── public/
    └── gem.jpg                      # Machine illustration
```

---

## 🎨 Design System

**Color Palette:**
- Primary: Amber/Orange gradient (#F59E0B to #F97316)
- Success: Emerald (#10B981)
- Warning: Rose (#F43F5E)
- Info: Indigo (#818CF8)
- Backgrounds: Off-white (#FAFAF9)
- Text: Gray scale (900-500)

**Typography:**
- Headings: Bold, large (text-3xl to text-6xl)
- Body: Base size with clear hierarchy
- Accent: Gradient text for brand elements

**Components:**
- Cards: rounded-2xl, border-2, shadow-sm
- Buttons: Gradient backgrounds, bold text
- Forms: border-2 inputs with amber focus states
- Badges: Contextual colors (emerald/amber/gray)

---

## 🤖 AI Integration

### How AI Research Works

When you click "Analyse with AI" on a project:

1. **Backend API Call** (`/api/research`)
   - Fetches project details from Supabase
   - Constructs prompt for Claude API

2. **Claude Analysis**
   - Analyzes project description, goals, constraints
   - Uses training knowledge (not live web data)
   - Returns structured JSON response

3. **Data Stored**
   - Research results saved to `ai_research` table
   - Metrics calculated and cached
   - Available for bubble chart visualization

### What Claude Analyzes
- Market demand (1-10 score)
- Competitor landscape
- Unique selling proposition
- Revenue potential (min/max estimates)
- Build costs (initial + recurring)
- Timeline (weeks to build)
- Audience size and accessibility
- Required skills and technologies
- Key assumptions

**Note:** AI estimates are starting points for validation, not guarantees. Always do your own market research!

---

## 📈 Metrics & Scoring

### Value Score (Y-axis on bubble chart)
Calculated from:
- Base demand score (50% weight)
- Normalized profit potential (weighted by user slider)
- Normalized learning value (weighted by user slider)
- Audience size and accessibility

### Effort Score (X-axis on bubble chart)
Calculated from:
- Build time (weeks)
- Initial build costs
- Required skills complexity
- Risk tolerance adjustment

### Rank Score (Overall ranking)
Weighted combination:
- **Low Risk:** Value 40%, Ease 50%, Passion 10%
- **Medium Risk:** Value 60%, Ease 30%, Passion 10%
- **High Risk:** Value 80%, Ease 10%, Passion 10%

---

## 🎯 Use Cases

**For Indie Hackers:**
- Validate SaaS ideas before building
- Compare multiple product concepts
- Prioritize feature development

**For Entrepreneurs:**
- Choose between business opportunities
- Data-driven decision making
- Avoid "shiny object syndrome"

**For Developers:**
- Pick side projects strategically
- Balance learning vs. profit goals
- Build portfolio pieces that matter

**For Teams:**
- Align on roadmap priorities
- Evaluate new initiatives
- Resource allocation decisions

---

## 🏆 Hackathon Context

**Event:** AI Hackathon by Marcin Teodoru & Sabrina Ramonov  
**Dates:** March 7-9, 2026 (72 hours)  
**Team:** 
- **Shaan Mocke** - Full-stack development, AI integration, product strategy
- **Dr. Deb Prattley** - Design, UX, creative direction

**Build Journey:**
- **Day 1:** Core infrastructure, database setup, AI research endpoint, bubble chart v1
- **Day 2:** Light theme redesign, interactive sliders, whimsical machine page, mobile optimization

**Challenges Overcome:**
- Real-time bubble chart calculations with smooth animations
- Balancing serious functionality with playful design
- Creating meaningful AI prompts for accurate project analysis
- Mobile-first responsive design in tight timeline

---

## 🔮 Future Enhancements

**Planned Features:**
- [ ] Side-by-side project comparison table
- [ ] Export reports to PDF
- [ ] User authentication and multi-user support
- [ ] Team collaboration features
- [ ] Integration with project management tools
- [ ] Historical tracking (track projects over time)
- [ ] Community voting on project ideas
- [ ] Live web research (complement Claude's knowledge)
- [ ] Custom weighting formulas
- [ ] API for third-party integrations

**Design Improvements:**
- [ ] Dark mode toggle
- [ ] More animation options
- [ ] Custom themes
- [ ] Accessibility enhancements (WCAG AAA)

---

## 🤝 Contributing

This was built for a hackathon, but we welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

**Shaan Mocke**
- Developer turned veterinarian then turned developer again
- Brisbane, Australia
- [LinkedIn](https://linkedin.com/in/shaan-mocke) | [GitHub](https://github.com/shaanmd)

**Dr. Deb Prattley**
- Veterinary rehabilitation specialist
- New Zealand
- Product strategist and UX enthusiast

---

## 🙏 Acknowledgments

- **Anthropic** for Claude API and amazing AI capabilities
- **Cursor** for a great IDE
- **Vercel** for seamless deployment
- **Supabase** for the database infrastructure
- **Marcin Teodoru & Sabrina Ramonov** for organizing the hackathon
- **The AI community** for inspiration and support

---

## 📞 Contact

Have questions? Want to collaborate?

- **Email:** shaan.mocke@gmail.com
---

## ⭐ Star Us!

If this project helped you prioritize your ideas (or just made you smile), give us a star! ⭐

**Built with ❤️ in 72 hours using Claude AI**

---

**Remember:** Stop drowning in possibilities. Start shipping winners. 🚀
