"use server";

import { db } from "@/utils/db/db";
import { workoutSession } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutSession(sessionId: number) {
    const session = await db.query.workoutSession.findFirst({
        where: eq(workoutSession.id, sessionId),
        with: {
            sets: true,
        },
    });

    if (!session) {
        throw new Error("Workout session not found");
    }

    return session;
}
