import { NextRequest, NextResponse } from "next/server";

// Simple test route to verify the params format works
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    return NextResponse.json({ id: params.id });
}
