import { db } from "@/utils/db/db";
import { InsertUser, usersTable, workoutPlan } from "@/utils/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq, inArray } from "drizzle-orm";

export const getUsersWithWorkoutPlans = async () => {
    const usersWithWorkoutPlans = await db.select({
        userId: workoutPlan.userId,
    }).from(workoutPlan).groupBy(workoutPlan.userId);
    const userIds : number[] = usersWithWorkoutPlans.map((userId) => userId?.userId).filter((id): id is number => id !== null)
    const users = await db.select().from(usersTable).where(
        inArray(usersTable.id, userIds)
    )
    return {success: true, data : users};
}

export async function getUser() {
    const supabase = await createClient();
    const {
        data: { user }, error,
    } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("User not found");
    }
    const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.phoneNumber, user.phone as string));

    return { user, dbUser: dbUser[0] };
}

export async function updateUser(id: number, data: InsertUser) {
    const updatedUser = await db
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, id))
        .returning();
    return updatedUser[0];
}