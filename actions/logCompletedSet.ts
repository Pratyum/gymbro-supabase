"use server";

import { db } from "@/utils/db/db";
import { workoutSessionItemSetLog } from "@/utils/db/schema";

export async function logCompletedSet(
    workoutSessionId: number,
    workoutPlanItemSetId: number,
    actualReps: string,
    actualWeight: string,
    actualRest: string,
) {
    try {
        await db.insert(workoutSessionItemSetLog).values({
            workoutSessionId,
            workoutPlanItemSetId,
            isCompleted: "true",
            actualReps,
            actualWeight,
            actualRest,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to log completed set:", error);
        return { success: false, error: "Failed to log completed set" };
    }
}
