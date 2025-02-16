import { getUser } from "@/actions/user";
import { createNewWorkoutPlan, getWorkoutPlansForUser } from "@/actions/workout-plan";
import { InsertWorkoutPlan } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";

// List all workout plans for the user
export async function GET(request: NextRequest){
    const {dbUser} = await getUser();
    const response = await getWorkoutPlansForUser(dbUser.id);
    return NextResponse.json(response);
}

// Create a new workout plan
export async function POST(request: NextRequest){
    const {dbUser} = await getUser();
    const payload : Omit<InsertWorkoutPlan ,'id'| 'userId'> = await request.json();
    const response = await createNewWorkoutPlan({...payload, userId: dbUser.id});
    return NextResponse.json(response);
}