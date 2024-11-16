import { generateState } from "@/utils/generate-state";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const scopes = [
        "pages_show_list",
        "pages_read_engagement",
        "leads_retrieval",
        "pages_manage_metadata",
    ].join(",");

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${
        process.env.FACEBOOK_APP_ID
    }&redirect_uri=${encodeURIComponent(
        `${req.nextUrl.origin}/api/auth/facebook/callback`,
    )}&scope=${scopes}&response_type=code&state=${generateState()}`;

    return NextResponse.json({ url });
}
