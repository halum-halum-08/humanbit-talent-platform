# GitHub Deployment Guide for HumanBit Talent Platform

## 🚀 Quick Deployment Steps

### Step 1: Initialize Git Repository
```bash
# Navigate to project directory
cd "c:\Users\HP\HumanBit Assignment\humanbit-talent-platform"

# Initialize git (if not already done)
git init

# Configure git user (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `humanbit-talent-platform`
5. Description: `AI-powered talent recruitment platform with dynamic job generation and LinkedIn candidate search`
6. Set to **Public** (so others can access it)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

### Step 3: Connect Local Repository to GitHub
```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: HumanBit Talent Platform with enhanced job description generator

Features:
- AI-powered job description generator with dynamic content
- LinkedIn Sales Navigator integration
- Modern dark theme UI with glassmorphism design
- Real-time candidate search and filtering
- Responsive design with animations"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/humanbit-talent-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel (Automatic)
The repository includes a `.github/workflows/deploy.yml` file for automatic Vercel deployment:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Import Project"
3. Select your `humanbit-talent-platform` repository
4. Configure environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `RAPIDAPI_KEY`: Your RapidAPI key for LinkedIn integration
   - `RAPIDAPI_HOST`: `linkedin-api8.p.rapidapi.com`
5. Click "Deploy"

### Step 5: Set Up Environment Variables
After deployment, add these environment variables in Vercel dashboard:

```env
OPENAI_API_KEY=your_openai_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=linkedin-api8.p.rapidapi.com
```

## 🔧 Alternative Manual Commands

If you prefer to use the command line for everything:

```bash
# Check git status
git status

# View commit history
git log --oneline

# Push changes after updates
git add .
git commit -m "Update: [describe your changes]"
git push
```

## 🌐 Accessing Your Deployed Application

Once deployed:
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/humanbit-talent-platform`
- **Live Application**: `https://humanbit-talent-platform.vercel.app` (or your custom Vercel URL)

## 📋 Sharing with Others

To share your project:
1. **Repository URL**: Share the GitHub repository link
2. **Live Demo**: Share the Vercel deployment URL
3. **Setup Instructions**: Others can clone and run locally using the README.md

## 🛠️ Local Development for Contributors

Contributors can set up the project locally:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/humanbit-talent-platform.git
cd humanbit-talent-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

## 🚨 Important Notes

1. **Environment Variables**: Never commit API keys to GitHub
2. **Public Repository**: Code will be visible to everyone
3. **API Limits**: Consider rate limiting for public deployment
4. **Demo Mode**: Application includes demo functionality when API keys are not available

## 📞 Support

If you encounter issues:
1. Check the GitHub Issues tab in your repository
2. Ensure all environment variables are set correctly
3. Verify API keys are valid and have sufficient credits
4. Check Vercel deployment logs for errors
