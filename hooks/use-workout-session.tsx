"use client";

import {
    WorkoutSessionWithPlan,
    WorkoutSession,
    WorkoutPlanItem,
    WorkoutSessionItemLog,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type WorkoutSessionProps = {
  workoutSessionId: number;
};

export const useWorkoutSession = ({
    workoutSessionId,
}: WorkoutSessionProps) => {
    const router = useRouter();
    const {
        data: workoutSession,
        isPending: isWorkoutSessionLoading,
        refetch: refetchWorkoutSession,
    } = useQuery({
        queryKey: ["workout-session", workoutSessionId],
        queryFn: async () => {
            const response = await fetch(`/api/workout-session/${workoutSessionId}`, {
                credentials: "include",
            });
            const { data = null } = await response.json();
            return data as WorkoutSessionWithPlan;
        },
    });

    const { mutateAsync: updateWorkoutSessionInDb } = useMutation({
        mutationFn: async (payload: Partial<WorkoutSession>) => {
            const response = await fetch(`/api/workout-session/${workoutSessionId}`, {
                credentials: "include",
                method: "PATCH",
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            return data;
        },
    });

    // Workout Item Create
    const { mutateAsync: addWorkoutItemToDb } = useMutation({
        mutationFn: async (
            payload: Omit<WorkoutSessionItemLog, "id" | "workoutSessionId">,
        ) => {
            const response = await fetch(
                `/api/workout-session/${workoutSessionId}/item`,
                {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify(payload),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // Workout Item Delete
    const { mutateAsync: removeWorkoutItemInDb } = useMutation({
        mutationFn: async ({
            workoutPlanItemId,
        }: {
      workoutPlanItemId: number;
    }) => {
            const response = await fetch(
                `/api/workout-session/${workoutSessionId}/item/${workoutPlanItemId}`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // Workout Item Update
    const { mutateAsync: updateWorkoutPlanItemInDb } = useMutation({
        mutationFn: async ({
            workoutPlanItemId,
            workoutPlanItem,
        }: {
      workoutPlanItemId: number;
      workoutPlanItem: Partial<WorkoutPlanItem>;
    }) => {
            const response = await fetch(
                `/api/workout-session/${workoutSessionId}/item/${workoutPlanItemId}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    body: JSON.stringify(workoutPlanItem),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // Workout Session Item Log Create
    const { mutateAsync: addWorkoutSessionItemLogToDb } = useMutation({
        mutationFn: async (
            payload: Omit<WorkoutSessionItemLog, "id" | "workoutSessionId">,
        ) => {
            const response = await fetch(`/api/workout-session/${workoutSessionId}`, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            return data;
        },
    });

    // Workout Session Item Log Delete
    const { mutateAsync: removeWorkoutSessionItemLogInDb } = useMutation({
        mutationFn: async ({
            workoutSessionItemLogId,
        }: {
      workoutSessionItemLogId: number;
    }) => {
            const response = await fetch(
                `/api/workout-session/${workoutSessionId}/log/${workoutSessionItemLogId}`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // Workout Session Item Log Update
    const { mutateAsync: updateWorkoutSessionItemLogInDb } = useMutation({
        mutationFn: async ({
            workoutSessionItemLogId,
            workoutSessionItemLog,
        }: {
      workoutSessionItemLogId: number;
      workoutSessionItemLog: Partial<WorkoutSessionItemLog>;
    }) => {
            const response = await fetch(
                `/api/workout-session/${workoutSessionId}/log/${workoutSessionItemLogId}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    body: JSON.stringify(workoutSessionItemLog),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    const exercises = useMemo(() => {
        if (!workoutSession) {
            return [];
        }
        return (
            workoutSession.workoutPlan?.items
                .map((item) => item.exerciseId ?? null)
                .filter(Boolean) ?? []
        );
    }, [workoutSession]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

    const nextExercise = () => {
        if (currentExerciseIndex === ((workoutSession?.workoutPlan?.items.length??0) - 1)) {
            updateWorkoutSessionInDb({
                completed: "true",
            })
            router.push("/workouts");
            return;
        }
        setCurrentExerciseIndex((prev) => prev + 1);
    };

    const previousExercise = () => {
        if (currentExerciseIndex === 0) {
            return;
        }
        setCurrentExerciseIndex((prev) => prev - 1);
    };

    // start workout session
    const startWorkoutSession = async () => {
        await updateWorkoutSessionInDb({
            startedAt: new Date(),
        });
        refetchWorkoutSession();
    };

    const resetWorkoutSession = async () => {
        await updateWorkoutSessionInDb({
            startedAt: new Date(),
        });
        setCurrentExerciseIndex(0);
        refetchWorkoutSession();
    };

    // log workout session item for workout session

    // on next exercise

    // on previous exercise

    // Finish workout session

    return {
        isWorkoutSessionLoading,
        workoutSession,
        refetchWorkoutSession,
        updateWorkoutSessionInDb,
        addWorkoutItemToDb,
        updateWorkoutPlanItemInDb,
        removeWorkoutItemInDb,
        addWorkoutSessionItemLogToDb,
        updateWorkoutSessionItemLogInDb,
        removeWorkoutSessionItemLogInDb,
        exercises,
        currentExerciseIndex,
        nextExercise,
        previousExercise,
        startWorkoutSession,
        resetWorkoutSession,
    };
};
