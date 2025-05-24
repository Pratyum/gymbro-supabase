import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/actions/user";
import { createDailyGoals, updateDailyGoals, getDailyGoalsForUser } from "@/actions/goals";
import { InsertDailyGoals } from "@/utils/db/schema";

export async function GET(request: NextRequest) {
    try {
        const { dbUser } = await getUser();
        const { searchParams } = request.nextUrl;
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        const response = await getDailyGoalsForUser(parseInt(userId, 10));
        return NextResponse.json(response);
    } catch (error) {
        console.error("Failed to get daily goals:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { dbUser } = await getUser();
        const payload: InsertDailyGoals = await request.json();

        // Validate trainer has access to create goals for this user
        if (dbUser.role !== "admin" && dbUser.role !== "trainer") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        const response = await createDailyGoals(payload);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Failed to create daily goals:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { dbUser } = await getUser();
        const { userId, ...payload }: { userId: number } & Partial<InsertDailyGoals> = await request.json();

        // Validate trainer has access to update goals for this user
        if (dbUser.role !== "admin" && dbUser.role !== "trainer") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        const response = await updateDailyGoals(userId, payload);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Failed to update daily goals:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}