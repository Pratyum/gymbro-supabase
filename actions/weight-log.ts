"use server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { SelectWeightLog, usersTable, weightLog } from "@/utils/db/schema";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

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
    .where(eq(weightLog.userId, dbUser.id))
    .orderBy(asc(weightLog.date));
  return weightLogs;
}

export async function addWeightLog(
  currentState: { message: string },
  formData: FormData
) {
  console.log(formData.has("photo"));
  if (formData.get("weight") === null || formData.get("date") === null) {
    return { message: "Please fill all the fields" };
  }
  const { user, dbUser } = await getUser();

  try {
    const weight = formData.get("weight") as string;
    const date = formData.get("date") as string;
    let payload : Omit<SelectWeightLog,'id'> = {
      userId: dbUser.id,
      weight: weight,
      date: new Date(date),
      photoUrl: null,
    }
    // Upload photo if it exists in the form data
    if (formData.has("photo")) {
      const photo = formData.get("photo") as File;
      const isValidPhoto = photo && photo.size && photo.type.includes("image");
      if (isValidPhoto) {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from("user-weight-log")
          .upload(
            `${user.id}/${format(new Date(date), "MM_dd_yyyy")}.${photo.type.split("/")[1]}`,
            photo,
            {
              upsert: false,
              contentType: photo.type,
              metadata: {
                user_id: user.id,
                date: date,
              },
            }
          );
          payload.photoUrl = data?.fullPath ?? null;
        if (error) {
          return { message: error.message };
        }
      }
    }
    await db.insert(weightLog).values(payload);

    revalidatePath("/weight");
    return { message: "" };
  } catch (e: any) {
    return { message: "Something went wrong" };
  }
}
