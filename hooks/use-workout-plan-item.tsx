"use client";

import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type WorkoutPlanItemProps = {
  workoutPlanItem: WorkoutPlanItem & { sets: WorkoutPlanItemSet[] };
};
export const useWorkoutPlanItem = ({
    workoutPlanItem,
}: WorkoutPlanItemProps) => {
    const { data: exerciseData } = useQuery({
        queryKey: ["exercise", workoutPlanItem.exerciseId],
        queryFn: async () => {
            const response = await fetch(
                `/api/exercise/${workoutPlanItem.exerciseId}`,
                {
                    credentials: "include",
                },
            );
            const data = (await response.json()).data;
            return data as Exercise;
        },
    });

    const { mutateAsync: updateWorkoutPlanItemInDb } = useMutation({
        mutationFn: async (payload: Partial<WorkoutPlanItem>) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    body: JSON.stringify(payload),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // Add a new set
    const { mutateAsync: addSetToDb } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}`,
                {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({
                        weight: "10",
                        reps: "10",
                        rest: "30",
                    }),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // update the current set
    const { mutateAsync: updateSetToDb } = useMutation({
        mutationFn: async ({
            reps,
            rest,
            weight,
            id,
        }: Partial<WorkoutPlanItemSet>) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}/${id}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    body: JSON.stringify({
                        reps,
                        rest,
                        weight,
                    }),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    // remove the current set
    const { mutateAsync: removeSetFromDb } = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}/${id}`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );
            const data = await response.json();
            return data;
        },
    });

    return {
        exerciseData,
        updateWorkoutPlanItemInDb,
        addSetToDb,
        updateSetToDb,
        removeSetFromDb,
    };
};
