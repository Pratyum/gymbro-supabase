import { getUser } from "@/actions/weight-log";
import { createNewWorkoutPlan } from "@/actions/workout-plan";
import { redirect } from "next/navigation";

export default async function WorkoutPlanPage(){
    // Create a new workout plan and redirect to that workout plan page
    const {dbUser} = await getUser();
    const {success, data} = await createNewWorkoutPlan({
        userId: dbUser.id,
        friendlyName: 'New Workout Plan'
    });
    console.log(data);

    if(success && data.length){
        const workoutPlanId = data[0].id;
        redirect(`/workouts/plan/${workoutPlanId}`);
    }
    if(!success || data.length === 0){
        return <div>Failed to create a new workout plan</div>
    }
    return <div>Creating a new workout plan...</div>
}