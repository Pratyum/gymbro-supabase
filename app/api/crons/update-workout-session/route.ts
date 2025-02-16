import { getUsersWithWorkoutPlans } from "@/actions/user";
import { getUser } from "@/actions/user";
import { populateWorkoutSessionsForUserFromWorkoutPlans } from "@/actions/workout-session";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const supabase = await createClient();
    const {error , data : {user}} = await supabase.auth.getUser();
    if(error){
        return NextResponse.json({ok: false, error: error.message} , {status: 500});
    }
    if(user === null){
        // Anonymous GET request. Check if is from the cron job
        if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ok: false, error: "Unauthorized"} , {status: 401});
        }
        // Authenticated Cron Job Request
        const users = await getUsersWithWorkoutPlans();
        await Promise.allSettled(
            users.data.map(async (users) => {
                populateWorkoutSessionsForUserFromWorkoutPlans(users.id);
            })
        )
    }else{
        // Authenticated GET Request. Populate only for the current user
        const {dbUser} = await getUser();
        await populateWorkoutSessionsForUserFromWorkoutPlans(dbUser.id);
    }
    return NextResponse.json({ok: true});
}