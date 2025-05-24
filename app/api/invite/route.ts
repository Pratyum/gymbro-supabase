// app/api/invite/route.ts
import { getUser } from "@/actions/user";
import { inviteUser } from "@/app/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { dbUser } = await getUser();
        const payload = await request.json();

        // Ensure the user has permission to invite
        if (!dbUser.organizationId && dbUser.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "You don't have permission to invite users" },
                { status: 403 }
            );
        }

        // Call the inviteUser action with the payload
        const result = await inviteUser(
            { message: "" },
            {
                get: (key) => payload[key],
                has: (key) => payload[key] !== undefined,
            } as FormData
        );

        if (result.message) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Invite error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send invitation" },
            { status: 500 }
        );
    }
}