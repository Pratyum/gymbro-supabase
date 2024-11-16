import WorkoutSession from "@/components/workouts/workout-session";

export default async function WorkoutSessionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <WorkoutSession sessionId={parseInt(params.id, 10)} />;
}
