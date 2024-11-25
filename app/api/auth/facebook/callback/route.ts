import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { socialIntegrations } from "@/utils/db/schema";
import { verifyState } from "@/utils/verify-state";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const { dbUser } = await getUser();
    // Verify state to prevent CSRF
    if (!verifyState(state)) {
        return NextResponse.redirect("/settings/facebook?error=invalid_state");
    }

    try {
    // Exchange code for access token
        const tokenResponse = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${
                process.env.FACEBOOK_APP_ID
            }&client_secret=${
                process.env.FACEBOOK_APP_SECRET
            }&redirect_uri=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
            )}&code=${code}`,
        );

        const { access_token, expires_in } = await tokenResponse.json();

        // Get user's Facebook pages
        const pagesResponse = await fetch(
            `https://graph.facebook.com/v19.0/me/accounts?access_token=${access_token}`,
        );

        const { data: pages } = await pagesResponse.json();

        if (pages.length === 0) {
            return NextResponse.redirect("/settings/facebook?error=no_pages");
        }

        // Store the first page's access token (you might want to let users choose which page)
        const page = pages[0];

        await db.insert(socialIntegrations).values({
            organizationId: dbUser.organizationId,
            platform: "facebook",
            accessToken: page.access_token,
            pageId: page.id,
            pageName: page.name,
            expiresAt: new Date(Date.now() + expires_in * 1000),
        });

        return NextResponse.redirect("/settings/facebook?success=true");
    } catch (error) {
        console.error("Facebook OAuth error:", error);
        return NextResponse.redirect("/settings/facebook?error=auth_failed");
    }
}
