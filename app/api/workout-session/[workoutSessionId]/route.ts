import { getUser } from "@/actions/user";
import {
    createWorkoutSessionItemForWorkoutSession,
    getWorkoutSessionById,
    removeWorkoutSession,
    updateWorkoutSession,
} from "@/actions/workout-session";
import { WorkoutSessionItemLog } from "@/types";
import { InsertWorkoutSession } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check for access control in this file alone
async function doesUserHaveAccessToWorkoutSession(id: number) {
    const { dbUser } = await getUser();
    const response = await getWorkoutSessionById(id);
    if (response?.data?.userId !== dbUser.id) {
        return false;
    }
    return true;
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ workoutSessionId: string }> },
) {
    const params = await props.params;
    const { workoutSessionId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutSession(
        parseInt(workoutSessionId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout session",
        });
    }
    const response = await getWorkoutSessionById(parseInt(workoutSessionId, 10));

    return NextResponse.json(response);
}


export async function POST(
    request: NextRequest,
    props: { params: Promise<{ workoutSessionId: string }> },
) {
    const params = await props.params;
    const { workoutSessionId } = params;
    const payload: Omit<WorkoutSessionItemLog, "id" | "workoutSessionId"> = await request.json();

    const hasAccess = await doesUserHaveAccessToWorkoutSession(
        parseInt(workoutSessionId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout session",
        });
    }

    const response = await createWorkoutSessionItemForWorkoutSession(parseInt(workoutSessionId, 10), {
        ...payload,
    });
    return NextResponse.json(response);
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ workoutSessionId: string }> },
) {
    const params = await props.params;
    const { workoutSessionId } = params;
    const payload: Omit<InsertWorkoutSession, "userId" | "id"> =
    await request.json();
    const hasAccess = await doesUserHaveAccessToWorkoutSession(
        parseInt(workoutSessionId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout session",
        });
    }
    const response = await updateWorkoutSession(parseInt(workoutSessionId, 10), payload);
    return NextResponse.json(response);
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ workoutSessionId: string }> },
) {
    const params = await props.params;
    const { workoutSessionId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutSession(
        parseInt(workoutSessionId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout session",
        });
    }
    const response = await removeWorkoutSession(parseInt(workoutSessionId, 10));
    return NextResponse.json(response);
}