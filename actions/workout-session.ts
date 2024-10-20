'use server';

import { db } from "@/utils/db/db";
import { workoutSession } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { getWorkoutPlanById } from "./workout-plan";
import { WorkoutPlanWithItemsAndSets } from "@/types";

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

export const getWorkoutSessionForUser = async (userId: number) => {
    const workoutSessions = await db.select().from(workoutSession).where(
        and(
            eq(workoutSession.userId, userId),
        ));
    console.log(workoutSessions);
    if (!workoutSessions) {
        return { success: false, data: undefined };
    }
    if(!workoutSessions.length){
        return { success: true, data: [] };
    }
    const workoutPlanIds = new Set(workoutSessions.map((workoutSession) => workoutSession.workoutPlanId).filter(f => !!f));

    const promises = Array.from(workoutPlanIds).map(async (workoutPlanId) => {
        if(!workoutPlanId)return Promise.resolve();
        const {data, success} = await getWorkoutPlanById(workoutPlanId);
        if(!success || !data) return Promise.resolve();
        return data;
    });

    const responses = await Promise.allSettled(promises);

    const workoutDataMap = responses.reduce((acc : {[id:number]: WorkoutPlanWithItemsAndSets}, response) => {
        if(response.status === "fulfilled"){
            if(response.value) acc[response.value.id] = response.value;
        }
        return acc;
    }, {});

    const workoutSessionData = workoutSessions.map((workoutSession) => {
        const workoutPlan = workoutSession.workoutPlanId ? workoutDataMap[workoutSession.workoutPlanId] : null;
        return {
            ...workoutSession,
            workoutPlan,
        };
    });

    return {
        success: true,
        data: workoutSessionData,
    };
}