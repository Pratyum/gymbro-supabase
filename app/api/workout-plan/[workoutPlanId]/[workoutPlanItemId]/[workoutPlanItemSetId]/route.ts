import { getUser } from "@/actions/weight-log";
import {
  getWorkoutPlanById,
  removeWorkoutPlanItemSet,
  updateWorkoutPlanItemSet,
} from "@/actions/workout-plan";
import { InsertWorkoutPlanItemSet } from "@/utils/db/schema";
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
    params: Promise<{
      workoutPlanId: string;
      workoutPlanItemId: string;
      workoutPlanItemSetId: string;
    }>;
  },
) {
  const params = await props.params;
  const { workoutPlanId, workoutPlanItemSetId } = params;
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
  const response = await updateWorkoutPlanItemSet(
    parseInt(workoutPlanItemSetId, 10),
    payload,
  );
  return NextResponse.json(response);
}

export async function DELETE(
  request: NextRequest,
  props: {
    params: Promise<{
      workoutPlanId: string;
      workoutPlanItemId: string;
      workoutPlanItemSetId: string;
    }>;
  },
) {
  const params = await props.params;
  const { workoutPlanId, workoutPlanItemId, workoutPlanItemSetId } = params;
  const hasAccess = await doesUserHaveAccessToWorkoutPlan(
    parseInt(workoutPlanId, 10),
  );
  if (!hasAccess) {
    return NextResponse.json({
      success: false,
      message: "You do not have access to this workout plan",
    });
  }
  const response = await removeWorkoutPlanItemSet(
    parseInt(workoutPlanItemSetId, 10),
  );
  return NextResponse.json(response);
}
