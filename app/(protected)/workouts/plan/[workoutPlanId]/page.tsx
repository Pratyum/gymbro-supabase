import WorkoutPlanner from "@/components/workout-planner/workout-planner";

export default async function WorkoutPlanPage(props: {
  params: Promise<{
    workoutPlanId: string;
  }>;
}) {
    const params = await props.params;
    return <WorkoutPlanner workoutPlanId={parseInt(params.workoutPlanId, 10)} />;
}
