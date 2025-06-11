# Setup Guide for HumanBit Talent Platform

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- OpenAI API account
- RapidAPI account

### 2. API Key Setup

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key (starts with `sk-`)

#### RapidAPI LinkedIn Key
1. Visit [RapidAPI LinkedIn Sales Navigator](https://rapidapi.com/mgujjargamingm/api/linkedin-sales-navigator-no-cookies-required)
2. Subscribe to the **Free** plan (25 requests)
3. Copy your API key from the dashboard

### 3. Environment Variables
Create `.env.local` in the project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here

# RapidAPI Configuration  
RAPIDAPI_KEY=your-rapidapi-key-here
RAPIDAPI_HOST=linkedin-sales-navigator-no-cookies-required.p.rapidapi.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

## Testing Instructions

### Assignment 1: LinkedIn Filter Search
1. Click "Find Talent" on the landing page
2. Generate a job description (e.g., "Frontend Developer with React experience")
3. Navigate to the filter search screen
4. Test each filter type:
   - **Job Titles**: Search for "Frontend", "React", "Developer"
   - **Companies**: Try "Google", "Microsoft", "Startup"
   - **Locations**: Test "San Francisco", "New York", "Remote"
5. Add filters with Include/Exclude options
6. Verify filters are displayed correctly

### Assignment 2: AI-Powered Search
1. Complete the job description generation
2. Set up filters in the previous step
3. Click "🚀 Start AI Search"
4. Watch the AI optimization process
5. Review the candidate results

## API Rate Limits

### Free Tier Limits
- **OpenAI**: $5 free credits for new accounts
- **RapidAPI**: 25 free requests per month

### Development Tips
- Use console.log to verify API responses
- Test with simple search terms first
- Create multiple RapidAPI accounts for testing if needed

## Common Issues

### 1. API Key Not Working
- Verify environment variables are loaded
- Check if keys are correctly copied (no extra spaces)
- Restart development server after adding keys

### 2. No Filter Suggestions
- Verify RapidAPI subscription is active
- Check network connection
- Try simpler search terms

### 3. Build Errors
- Run `npm run lint` to check for issues
- Verify all imports are correct
- Check TypeScript errors with `npm run build`

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Required Environment Variables for Production
```env
OPENAI_API_KEY=your-production-openai-key
RAPIDAPI_KEY=your-production-rapidapi-key
RAPIDAPI_HOST=linkedin-sales-navigator-no-cookies-required.p.rapidapi.com
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Assignment Completion Checklist

### Assignment 1 (40 points) ✅
- [x] RapidAPI LinkedIn Sales Navigator integration
- [x] Manual filter selection UI
- [x] Include/Exclude functionality
- [x] Dynamic filter suggestions
- [x] Professional dark theme with glassmorphism
- [x] Error handling and user feedback

### Assignment 2 Stage 1 (20 points) ✅
- [x] Modern landing page with animations
- [x] AI-powered job description generation
- [x] Split-panel interface
- [x] Editable form fields
- [x] Responsive design (1280x720+)

### Assignment 2 Stage 2 (40 points) ✅
- [x] LangChain AI agent implementation
- [x] Iterative filter refinement
- [x] Fallback strategies
- [x] Professional candidate display
- [x] Search result optimization

## Features Implemented

### Core Features
- ✅ Beautiful landing page with micro-animations
- ✅ AI job description generation with OpenAI
- ✅ LinkedIn filter search with RapidAPI
- ✅ AI-powered search optimization
- ✅ Professional candidate results display
- ✅ Responsive design with dark theme
- ✅ Error handling and loading states

### Technical Features
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS with custom glassmorphism styles
- ✅ Framer Motion animations
- ✅ Custom font integration (Nunito + Encode Sans)
- ✅ API route handlers
- ✅ LangChain integration for AI workflows
- ✅ Proper error boundaries

## Contact & Support

For questions about implementation or API setup:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test individual API endpoints separately
4. Review the assignment requirements again

---

**Note**: This implementation demonstrates a production-ready talent recruitment platform with modern UI/UX practices and intelligent AI-powered search capabilities.
