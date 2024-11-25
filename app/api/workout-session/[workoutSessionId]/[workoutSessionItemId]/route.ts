import { getUser } from "@/actions/user";
import { removeWorkoutPlanItemSet } from "@/actions/workout-plan";
import { getWorkoutSessionById, updateWorkoutSessionItemForWorkoutSession } from "@/actions/workout-session";
import { WorkoutSessionItemLog } from "@/types";
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


export async function DELETE(
    request: NextRequest,
    props: {
    params: Promise<{ workoutSessionId: string; workoutSessionItemLogId: string }>;
  },
) {
    const params = await props.params;
    const { workoutSessionId, workoutSessionItemLogId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutSession(
        parseInt(workoutSessionId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout session",
        });
    }
    const response = await removeWorkoutPlanItemSet(parseInt(workoutSessionItemLogId, 10));
    return NextResponse.json(response);
}

export async function PATCH(
    request: NextRequest,
    props: {
    params: Promise<{ workoutSessionId: string; workoutSessionItemLogId: string }>;
  },
) {
    const params = await props.params;
    const { workoutSessionId, workoutSessionItemLogId } = params;
    const payload: Omit<WorkoutSessionItemLog, "id" | "workoutSessionId"> =
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
    const response = await updateWorkoutSessionItemForWorkoutSession(
        parseInt(workoutSessionItemLogId, 10),
        payload,
    );
    return NextResponse.json(response);
}