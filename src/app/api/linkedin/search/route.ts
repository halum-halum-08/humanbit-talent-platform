import { NextRequest, NextResponse } from 'next/server';
import { LinkedInSearchAgent } from '@/lib/linkedin-agent';
import { JobDescription } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, useAI = true } = await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const searchAgent = new LinkedInSearchAgent();
    
    if (useAI) {
      // Use AI-powered optimization
      const result = await searchAgent.searchWithOptimization(jobDescription);
      
      return NextResponse.json({
        profiles: result.profiles,
        filters: result.filters,
        iterations: result.iterations,
        totalResults: result.profiles.length,
        success: result.profiles.length >= 50
      });
    } else {
      // Generate basic filters only
      const filters = await searchAgent.generateInitialFilters(jobDescription);
      
      return NextResponse.json({
        filters,
        message: 'Initial filters generated successfully'
      });
    }
  } catch (error) {
    console.error('Error in LinkedIn search API:', error);
    return NextResponse.json(
      { error: 'Failed to search LinkedIn profiles' },
      { status: 500 }
    );
  }
}
