import { NextRequest, NextResponse } from 'next/server';
import { generateJobDescription } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.log('❌ Invalid prompt received:', prompt);
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      );
    }

    console.log('🚀 API: Generating job description for prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    console.log('📊 Full prompt length:', prompt.length, 'characters');
    
    const startTime = Date.now();
    const jobDescription = await generateJobDescription(prompt.trim());
    const duration = Date.now() - startTime;
    
    console.log('✅ API: Job description generated successfully in', duration, 'ms');
    console.log('📄 Generated job title:', jobDescription.title);
    console.log('🏢 Company:', jobDescription.company);
    console.log('📍 Location:', jobDescription.location);
    
    return NextResponse.json(jobDescription);
  } catch (error) {
    console.error('❌ API Error in generate-job:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate job description',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
