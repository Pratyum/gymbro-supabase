import { getExerciseById } from '@/actions/exercises';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {

    const id = parseInt(params.id, 10);
  
    // Find the exercise with the matching id
    const response = await getExerciseById(id);
    return NextResponse.json(response);
}