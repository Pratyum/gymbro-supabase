import { getUser } from "@/actions/user";
import {
    addWorkoutPlanItem,
    getWorkoutPlanById,
    removeWorkoutPlan,
    updateWorkoutPlan,
} from "@/actions/workout-plan";
import { InsertWorkoutPlan, InsertWorkoutPlanItem } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check for access control in this file alone
async function doesUserHaveAccessToWorkoutPlan(id: number) {
    const { dbUser } = await getUser();
    const response = await getWorkoutPlanById(id);
    if (response?.data?.userId !== dbUser.id) {
        return false;
    }
    return true;
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ workoutPlanId: string }> },
) {
    const params = await props.params;
    const { workoutPlanId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutPlan(
        parseInt(workoutPlanId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout plan",
        });
    }
    const response = await getWorkoutPlanById(parseInt(workoutPlanId, 10));

    return NextResponse.json(response);
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ workoutPlanId: string }> },
) {
    const params = await props.params;
    const { workoutPlanId } = params;
    const payload: Omit<InsertWorkoutPlan, "userId" | "id"> =
    await request.json();
    const hasAccess = await doesUserHaveAccessToWorkoutPlan(
        parseInt(workoutPlanId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout plan",
        });
    }
    const response = await updateWorkoutPlan(parseInt(workoutPlanId, 10), {
        ...(payload.frequency && { frequency: payload.frequency }),
        ...(payload.startDate && { startDate: new Date(payload.startDate) }),
        ...(payload.friendlyName && { friendlyName: payload.friendlyName }),
    });
    return NextResponse.json(response);
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ workoutPlanId: string }> },
) {
    const params = await props.params;
    const { workoutPlanId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutPlan(
        parseInt(workoutPlanId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout plan",
        });
    }
    const response = await removeWorkoutPlan(parseInt(workoutPlanId, 10));
    return NextResponse.json(response);
}

// Post method is for creating a new workout plan item
export async function POST(
    request: NextRequest,
    props: {
    params: Promise<{ workoutPlanId: string }>;
  },
) {
    const params = await props.params;
    const { workoutPlanId } = params;
    const payload: Omit<InsertWorkoutPlanItem, "id" | "workoutPlanId"> =
    await request.json();

    const hasAccess = await doesUserHaveAccessToWorkoutPlan(
        parseInt(workoutPlanId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout plan",
        });
    }

    const response = await addWorkoutPlanItem({
        ...payload,
        workoutPlanId: parseInt(workoutPlanId, 10),
    });
    return NextResponse.json(response);
}
