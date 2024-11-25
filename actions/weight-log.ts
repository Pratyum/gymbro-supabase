"use server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { SelectWeightLog, weightLog } from "@/utils/db/schema";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { getUser } from "./user";

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
    formData: FormData,
) {
    if (formData.get("weight") === null || formData.get("date") === null) {
        return { message: "Please fill all the fields" };
    }
    const { user, dbUser } = await getUser();

    try {
        const weight = formData.get("weight") as string;
        const date = formData.get("date") as string;
        let payload: Omit<SelectWeightLog, "id"> = {
            userId: dbUser.id,
            weight: weight,
            date: new Date(date),
            photoUrl: null,
        };
        // Upload photo if it exists in the form data
        if (formData.has("photo")) {
            const photo = formData.get("photo") as File;
            const isValidPhoto = photo && photo.size && photo.type.includes("image");
            if (isValidPhoto) {
                const supabase = await createClient();
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
                        },
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
