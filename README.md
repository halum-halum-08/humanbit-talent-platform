# HumanBit Talent Platform

A modern, AI-powered talent recruitment platform built with Next.js 14, TypeScript, and Tailwind CSS. This application helps recruiters generate job descriptions using OpenAI and find candidates through LinkedIn Sales Navigator integration.

## 🚀 Features

### Assignment 1: LinkedIn Sales Navigator Dark Mode (40 Points)
- **Manual Filter Selection**: Interactive filter search with RapidAPI LinkedIn integration
- **Dynamic Suggestions**: Real-time filter suggestions for job titles, companies, locations
- **Include/Exclude Logic**: Flexible filtering with include/exclude options
- **Professional UI**: Dark theme with glassmorphism design elements

### Assignment 2: Agentic LinkedIn Search (60 Points)

#### Stage 1: Landing Page & Job Description Generator (20 Points)
- **Modern Landing Page**: Dark theme with gradient accents and smooth animations
- **AI-Powered Generation**: OpenAI integration for comprehensive job descriptions
- **Interactive UI**: Responsive design with micro-animations
- **Editable Forms**: User-friendly form fields with validation

#### Stage 2: AI-Powered Filter Optimization (40 Points)
- **Intelligent Search**: AI-driven filter optimization and refinement
- **Iterative Improvement**: Automatic fallback strategies for better results
- **Profile Display**: Clean presentation of LinkedIn candidate profiles
- **Result Management**: Pagination and professional candidate information display

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Custom glassmorphism components with Framer Motion
- **AI Integration**: OpenAI API with structured outputs
- **External APIs**: RapidAPI LinkedIn Sales Navigator
- **Fonts**: Nunito (body), Encode Sans (headings)
- **Animation**: Framer Motion for smooth transitions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd humanbit-talent-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # RapidAPI Configuration
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=linkedin-sales-navigator-no-cookies-required.p.rapidapi.com
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy to GitHub & Vercel

### Quick Deployment
1. **Create GitHub Repository**
   - Go to GitHub and create a new public repository named `humanbit-talent-platform`
   - Don't initialize with README (we already have one)

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HumanBit Talent Platform"
   git remote add origin https://github.com/YOUR_USERNAME/humanbit-talent-platform.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Connect your GitHub account to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables (OPENAI_API_KEY, RAPIDAPI_KEY, RAPIDAPI_HOST)
   - Deploy automatically

📋 **Detailed deployment guide**: See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)

## 🔧 Configuration

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Add it to your `.env.local` file

#### RapidAPI LinkedIn Integration
1. Visit [RapidAPI Hub](https://rapidapi.com/hub)
2. Create a free account
3. Subscribe to [LinkedIn Sales Navigator API](https://rapidapi.com/mgujjargamingm/api/linkedin-sales-navigator-no-cookies-required)
4. Copy your API key from the dashboard
5. Add it to your `.env.local` file
