import { NextRequest, NextResponse } from 'next/server';
import { getFilterSuggestions } from '@/lib/linkedin';

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json();

    if (!query || !type) {
      return NextResponse.json(
        { error: 'Query and type are required' },
        { status: 400 }
      );
    }

    const suggestions = await getFilterSuggestions(query, type);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in LinkedIn suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
