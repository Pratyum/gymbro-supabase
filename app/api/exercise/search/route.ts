import { searchExercises } from "@/actions/exercises";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query")?.toLowerCase() || "";
    const limit = searchParams.get("limit")
        ? parseInt(searchParams.get("limit") as string, 10)
        : 10;
    const offset = searchParams.get("offset")
        ? parseInt(searchParams.get("offset") as string, 10)
        : 0;

    const response = await searchExercises(query, limit, offset);

    return NextResponse.json(response);
}
