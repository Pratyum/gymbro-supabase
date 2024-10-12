"use server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { usersTable, weightLog } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// TODO: Move this to a utils function
export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
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

export async function getAllWeightLogs() {
  const { dbUser, user } = await getUser();
  const weightLogs = await db
    .select()
    .from(weightLog)
    .where(eq(weightLog.userId, dbUser.id));
  return weightLogs;
}

export async function addWeightLog(
  currentState: { message: string },
  formData: FormData
): Promise<{ message: string } | void> {
  const { user, dbUser } = await getUser();
  try {
    const weight = formData.get("weight") as string;
    const date = formData.get("date") as string;

    console.log(weight, date);
    

    const newWeightLog = await db.insert(weightLog).values({
      userId: dbUser.id,
      weight: weight,
      date: new Date(date),
    });

    console.log(newWeightLog);
    revalidatePath("/weight");
  } catch (e: any) {
    return { message: 'Something went wrong' };
  }
}
