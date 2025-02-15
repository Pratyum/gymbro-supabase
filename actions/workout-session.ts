"use server";

import { db } from "@/utils/db/db";
import {
    InsertWorkoutSession,
    workoutSession,
    workoutSessionItemSetLog,
} from "@/utils/db/schema";
import { and, asc, eq, gt, inArray } from "drizzle-orm";
import { getWorkoutPlanById, getWorkoutPlansForUser } from "./workout-plan";
import {
    DayOfWeek,
    WorkoutPlanWithItemsAndSets,
    WorkoutSessionItemLog,
    WorkoutSessionWithPlan,
} from "@/types";
import { addDays } from "date-fns";

const computeNextWorkoutSessionDateFromStartDateAndFrequency = (
    startDate: Date,
    frequency: DayOfWeek[],
) => {
    if (!frequency || !frequency.length) return null;
    const daysOfWeek = frequency.map((day) => parseInt(DayOfWeek[day], 10));
    const today = new Date();
    const daysToAdd = daysOfWeek.reduce((acc, day) => {
        const dayDiff =
      day - today.getDay() ? day - today.getDay() : 7 + day - today.getDay();
        if (dayDiff > acc) return dayDiff;
        return acc;
    }, 0);
    return addDays(startDate, daysToAdd);
};

export const populateWorkoutSessionItemsForWorkoutSession = async (
    workoutSessionId: number,
    workoutPlanId: number | null,
) => {
    if (!workoutPlanId) return;
    const workoutPlan = await getWorkoutPlanById(workoutPlanId);
    if (!workoutPlan.success || !workoutPlan.data) return;
    const workoutPlanData = workoutPlan.data;
    const workoutPlanItemIds = workoutPlanData.items.flatMap((item) => item.sets);
    const workoutSessionItemsToCreate: Omit<WorkoutSessionItemLog, "id">[] =
    workoutPlanItemIds.map((item) => {
        return {
            workoutSessionId,
            workoutPlanItemSetId: item.id,
            isCompleted: "false",
        };
    });
    await db.insert(workoutSessionItemSetLog).values(workoutSessionItemsToCreate);
};

export const populateWorkoutSessionsForUserFromWorkoutPlans = async (
    userId: number,
) => {
    const { data, success } = await getWorkoutPlansForUser(userId);
    if (!success || !data || !data.length) return;
    const workoutPlanIds = data.map((workoutPlan) => workoutPlan.id);
    const workoutSessions = await db
        .select()
        .from(workoutSession)
        .where(
            and(
                eq(workoutSession.userId, userId),
                inArray(workoutSession.workoutPlanId, workoutPlanIds),
                gt(workoutSession.plannedAt, new Date()),
            ),
        );
    // For all the workout plans that are not in the workout sessions, create a workout session
    const workoutPlanIdsInWorkoutSessions = new Set(
        workoutSessions.map((workoutSession) => workoutSession.workoutPlanId),
    );
    const workoutPlansToCreateWorkoutSessionsFor = data.filter(
        (workoutPlan) => !workoutPlanIdsInWorkoutSessions.has(workoutPlan.id),
    );
    const workoutSessionsToCreate: InsertWorkoutSession[] =
    workoutPlansToCreateWorkoutSessionsFor.map((workoutPlan) => {
        return {
            userId,
            workoutPlanId: workoutPlan.id,
            plannedAt: computeNextWorkoutSessionDateFromStartDateAndFrequency(
                workoutPlan.startDate ?? new Date(),
          workoutPlan.frequency as DayOfWeek[],
            ),
        };
    });
    console.log(
        `Creating ${workoutSessionsToCreate.length} workout sessions for user ${userId}`,
    );
    const workoutSessionsCreated = await db
        .insert(workoutSession)
        .values(workoutSessionsToCreate)
        .returning({
            id: workoutSession.id,
            workoutPlanId: workoutSession.workoutPlanId,
        });

    const workoutSessionItemsPromises = workoutSessionsCreated.map(
        (workoutSession) =>
            populateWorkoutSessionItemsForWorkoutSession(
                workoutSession.id,
                workoutSession.workoutPlanId,
            ),
    );
    await Promise.allSettled(workoutSessionItemsPromises);
};

export const getWorkoutSessionById = async (id: number) => {
    const res = await db
        .select()
        .from(workoutSession)
        .where(
            and(eq(workoutSession.id, id), eq(workoutSession.completed, "false")),
        );
    if (!res || !res.length) {
        return { success: false, data: undefined };
    }
    const workoutSessionData = res[0];
    const { success, data: workoutSessionSets } =
    await getWorkoutSessionItemsForWorkoutSession(id);
    if (workoutSessionData.workoutPlanId) {
        const { success, data: workoutPlan } = await getWorkoutPlanById(
            workoutSessionData.workoutPlanId,
        );
        return {
            success: true,
            data: {
                ...workoutSessionData,
                sets: workoutSessionSets,
                workoutPlan,
            } as WorkoutSessionWithPlan,
        };
    }

    return {
        success: true,
        data: workoutSessionData as WorkoutSessionWithPlan,
    };
};

export const getWorkoutSessionsForUser = async (userId: number) => {
    const workoutSessions = await db
        .select()
        .from(workoutSession)
        .where(and(eq(workoutSession.userId, userId)))
        .orderBy(asc(workoutSession.plannedAt));
    if (!workoutSessions) {
        return { success: false, data: undefined };
    }
    if (!workoutSessions.length) {
        return { success: true, data: [] };
    }
    const workoutPlanIds = new Set(
        workoutSessions
            .map((workoutSession) => workoutSession.workoutPlanId)
            .filter((f) => !!f),
    );

    const promises = Array.from(workoutPlanIds).map(async (workoutPlanId) => {
        if (!workoutPlanId) return Promise.resolve();
        const { data, success } = await getWorkoutPlanById(workoutPlanId);
        if (!success || !data) return Promise.resolve();
        return data;
    });
    const responses = await Promise.allSettled(promises);
    const workoutDataMap = responses.reduce(
        (acc: { [id: number]: WorkoutPlanWithItemsAndSets }, response) => {
            if (response.status === "fulfilled") {
                if (response.value) acc[response.value.id] = response.value;
            }
            return acc;
        },
        {},
    );

    const workoutSessionData = workoutSessions.map((workoutSession) => {
        const workoutPlan = workoutSession.workoutPlanId
            ? workoutDataMap[workoutSession.workoutPlanId]
            : null;
        return {
            ...workoutSession,
            workoutPlan,
        } as WorkoutSessionWithPlan;
    });

    return {
        success: true,
        data: workoutSessionData,
    };
};

export const createWorkoutSessionItemForWorkoutSession = async (
    workoutSessionId: number,
    workoutData: Omit<WorkoutSessionItemLog, "id" | "workoutSessionId">,
) => {
    const res = await db
        .insert(workoutSessionItemSetLog)
        .values({
            ...workoutData,
            workoutSessionId,
        })
        .returning();
    return { success: true, data: res };
};

export const updateWorkoutSessionItemForWorkoutSession = async (
    workoutSessionItemSetLogId: number,
    workoutData: Partial<WorkoutSessionItemLog>,
) => {
    const [res] = await db
        .update(workoutSessionItemSetLog)
        .set(workoutData)
        .where(and(eq(workoutSessionItemSetLog.id, workoutSessionItemSetLogId)))
        .returning();
    return { success: true, data: res };
};

export const updateWorkoutSession = async (
    workoutSessionId: number,
    workoutData: Partial<InsertWorkoutSession>,
) => {
    const res = await db
        .update(workoutSession)
        .set(workoutData)
        .where(and(eq(workoutSession.id, workoutSessionId)))
        .returning();
    return { success: true, data: res };
};

export const removeWorkoutSessionItemForWorkoutSession = async (
    workoutSessionItemId: number,
) => {
    await db
        .delete(workoutSessionItemSetLog)
        .where(and(eq(workoutSessionItemSetLog.id, workoutSessionItemId)));
    return { success: true };
};

export const removeWorkoutSession = async (workoutSessionId: number) => {
    await db
        .delete(workoutSession)
        .where(and(eq(workoutSession.id, workoutSessionId)));
    return { success: true };
};

export const getWorkoutSessionItemsForWorkoutSession = async (
    workoutSessionId: number,
) => {
    const workoutSessionItems = await db
        .select()
        .from(workoutSessionItemSetLog)
        .where(eq(workoutSessionItemSetLog.workoutSessionId, workoutSessionId));
    return {
        success: true,
        data: workoutSessionItems,
    };
};

export const getWorkoutSessionItemLogById = async (
    workoutSessionLogId: number,
) => {
    if (!workoutSessionLogId) {
        return { success: false, data: undefined };
    }
    const workoutSessionItemLog = await db
        .select()
        .from(workoutSessionItemSetLog)
        .where(eq(workoutSessionItemSetLog.id, workoutSessionLogId));

    if (!workoutSessionItemLog || !workoutSessionItemLog.length) {
        return { success: false, data: undefined };
    }

    return {
        succes: true,
        data: workoutSessionItemLog[0],
    };
};
