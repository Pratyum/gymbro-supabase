"use server";

import { db } from "@/utils/db/db";
import { dailyGoals, dailyGoalLogs, InsertDailyGoals, InsertDailyGoalLog } from "@/utils/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDailyGoals(payload: InsertDailyGoals) {
    try {
        const [result] = await db
            .insert(dailyGoals)
            .values(payload)
            .returning();
        
        revalidatePath("/admin/onboarding");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to create daily goals:", error);
        return { success: false, error: "Failed to create daily goals" };
    }
}

export async function updateDailyGoals(userId: number, payload: Partial<InsertDailyGoals>) {
    try {
        const [result] = await db
            .update(dailyGoals)
            .set({
                ...payload,
                updatedAt: new Date(),
            })
            .where(eq(dailyGoals.userId, userId))
            .returning();
        
        revalidatePath("/admin/onboarding");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to update daily goals:", error);
        return { success: false, error: "Failed to update daily goals" };
    }
}

export async function getDailyGoalsForUser(userId: number) {
    try {
        const [result] = await db
            .select()
            .from(dailyGoals)
            .where(eq(dailyGoals.userId, userId));
        
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to get daily goals:", error);
        return { success: false, error: "Failed to get daily goals" };
    }
}

export async function logDailyGoal(payload: InsertDailyGoalLog) {
    try {
        const [result] = await db
            .insert(dailyGoalLogs)
            .values(payload)
            .onConflictDoUpdate({
                target: [dailyGoalLogs.userId, dailyGoalLogs.date],
                set: {
                    stepsCompleted: payload.stepsCompleted,
                    waterCompleted: payload.waterCompleted,
                    sleepHours: payload.sleepHours,
                    updatedAt: new Date(),
                },
            })
            .returning();
        
        revalidatePath("/weight");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to log daily goal:", error);
        return { success: false, error: "Failed to log daily goal" };
    }
}

export async function getDailyGoalLogs(userId: number, startDate?: Date, endDate?: Date) {
    try {
        let query = db
            .select()
            .from(dailyGoalLogs)
            .where(eq(dailyGoalLogs.userId, userId)).$dynamic();

        if (startDate && endDate) {
            query = query.where(
                and(
                    eq(dailyGoalLogs.userId, userId),
                    // Add date range filtering here if needed
                )
            );
        }

        const results = await query.orderBy(dailyGoalLogs.date);
        
        return { success: true, data: results };
    } catch (error) {
        console.error("Failed to get daily goal logs:", error);
        return { success: false, error: "Failed to get daily goal logs" };
    }
}