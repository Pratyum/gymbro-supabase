import { getUser } from "@/actions/user";
import {
    addWorkoutPlanItemSet,
    getWorkoutPlanById,
    removeWorkoutPlanItem,
    updateWorkoutPlanItem,
} from "@/actions/workout-plan";
import {
    InsertWorkoutPlanItem,
    InsertWorkoutPlanItemSet,
} from "@/utils/db/schema";
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

export async function PATCH(
    request: NextRequest,
    props: {
    params: Promise<{ workoutPlanId: string; workoutPlanItemId: string }>;
  },
) {
    const params = await props.params;
    const { workoutPlanItemId, workoutPlanId } = params;
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
    const response = await updateWorkoutPlanItem(
        parseInt(workoutPlanItemId, 10),
        payload,
    );
    return NextResponse.json(response);
}

export async function DELETE(
    request: NextRequest,
    props: {
    params: Promise<{ workoutPlanId: string; workoutPlanItemId: string }>;
  },
) {
    const params = await props.params;
    const { workoutPlanId, workoutPlanItemId } = params;
    const hasAccess = await doesUserHaveAccessToWorkoutPlan(
        parseInt(workoutPlanId, 10),
    );
    if (!hasAccess) {
        return NextResponse.json({
            success: false,
            message: "You do not have access to this workout plan",
        });
    }
    const response = await removeWorkoutPlanItem(parseInt(workoutPlanItemId, 10));
    return NextResponse.json(response);
}

// Post method is for creating a new workout plan item set
export async function POST(
    request: NextRequest,
    props: {
    params: Promise<{ workoutPlanId: string; workoutPlanItemId: string }>;
  },
) {
    const params = await props.params;
    const { workoutPlanId, workoutPlanItemId } = params;
    const payload: Omit<InsertWorkoutPlanItemSet, "id" | "workoutPlanItemId"> =
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

    const response = await addWorkoutPlanItemSet({
        ...payload,
        workoutPlanItemId: parseInt(workoutPlanItemId, 10),
    });
    return NextResponse.json(response);
}
