import { getExerciseById } from "@/actions/exercises";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  const id = parseInt(params.id, 10);

  // Find the exercise with the matching id
  const response = await getExerciseById(id);
  return NextResponse.json(response);
}
