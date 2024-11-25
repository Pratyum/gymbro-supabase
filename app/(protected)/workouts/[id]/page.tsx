import { getExerciseByIds } from "@/actions/exercises";
import { getWorkoutSessionById } from "@/actions/workout-session";
import WorkoutSession from "@/components/workouts/workout-session";
import { SelectExercise } from "@/utils/db/schema";

export default async function WorkoutSessionPage(props: {
  params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const {success, data: workoutSession} = await getWorkoutSessionById(parseInt(params.id, 10));
    if(!success || !workoutSession){
        return <div>Workout session not found</div>;
    }
    const exerciseIds = (workoutSession.workoutPlan?.items??[]).map((item) => item.exerciseId).filter(Boolean);
    const {success: exResult, data: exerciseData} = await getExerciseByIds(exerciseIds);
    if(!exResult || !exerciseData){
        return <div>Failed to get exercises</div>;
    }
    const exerciseDataMap = exerciseData.reduce((acc, exercise) => {
        acc[exercise.id] = exercise;
        return acc;
    }, {} as Record<number, SelectExercise>);

    console.log(workoutSession, exerciseDataMap);

    return <WorkoutSession workoutSession={workoutSession} exerciseDataMap={exerciseDataMap} sessionId={parseInt(params.id, 10)} />;
}
