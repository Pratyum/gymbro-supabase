import { searchExercises } from '@/actions/exercises';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')?.toLowerCase() || '';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
  
    const response = await searchExercises(query, limit);
  
   return NextResponse.json(response);
}