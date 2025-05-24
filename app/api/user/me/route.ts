// app/api/user/me/route.ts
import { getUser } from "@/actions/user";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Use your existing getUser function to fetch the user data
        const { dbUser, user } = await getUser();

        return NextResponse.json({
            success: true,
            dbUser,
            user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}