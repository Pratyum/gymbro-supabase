import WorkoutPlanner from "@/components/workout-planner";


export default async function WorkoutPlanPage({params}: {
    params: {
        workoutPlanId: string
    }
}){
    return <WorkoutPlanner workoutPlanId={parseInt(params.workoutPlanId, 10)} />
}