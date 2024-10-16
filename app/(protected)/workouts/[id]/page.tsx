import WorkoutSession from "@/components/workouts/workout-session";

export default function WorkoutSessionPage({ params }: { params: { id: string } }) {
    console.log(params.id);
    return <WorkoutSession sessionId={parseInt(params.id, 10)} />
  }