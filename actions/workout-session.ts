'use server';

import { db } from "@/utils/db/db";
import { workoutSession } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { getWorkoutPlanById } from "./workout-plan";

export const getWorkoutSessionById = async (id: number) => {
    const res = await db.select().from(workoutSession).where(
        and(
            eq(workoutSession.id, id),
            eq(workoutSession.completed , "false"),
        ));
    if (!res || !res.length) {
        return { success: false, data: undefined };
    }
    const workoutSessionData = res[0];
    if(workoutSessionData.workoutPlanId){
        const {success, data: workoutPlan} = await getWorkoutPlanById(workoutSessionData.workoutPlanId);
        return {
            success: true,
            data: {
                ...workoutSessionData,
                workoutPlan,
            },
        }
    }

    return {
        success: true,
        data: workoutSessionData,
    };
}