"use client";

import {
    WorkoutPlan,
    WorkoutPlanItem,
    WorkoutPlanWithItemsAndSets,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type WorkoutPlanProps = {
  workoutPlanId: number;
};
export const useWorkoutPlan = ({ workoutPlanId }: WorkoutPlanProps) => {
    const {
        data: workoutPlan,
        isPending: isWorkoutPlanLoading,
        refetch: refetchWorkoutPlan,
    } = useQuery({
        queryKey: ["workout-plan", workoutPlanId],
        queryFn: async () => {
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
                credentials: "include",
            });
            const data = (await response.json()).data;
            return data as WorkoutPlanWithItemsAndSets;
        },
    });

    const { mutateAsync: updateWorkoutPlanInDb } = useMutation({
        mutationFn: async (payload: Partial<WorkoutPlan>) => {
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
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
        mutationFn: async () => {
            const payload: Omit<WorkoutPlanItem, "id"> = {
                exerciseId: 900,
                workoutPlanId: workoutPlanId,
                order: workoutPlan?.items.length ?? 0,
            };
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(payload),
            });
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
                `/api/workout-plan/${workoutPlanId}/${workoutPlanItemId}`,
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
            workoutPlan,
        }: {
      workoutPlanItemId: number;
      workoutPlan: Partial<WorkoutPlanItem>;
    }) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanId}/${workoutPlanItemId}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    body: JSON.stringify(workoutPlan),
                },
            );
            const data = await response.json();
            return data;
        },
    });

    return {
        isWorkoutPlanLoading,
        workoutPlan,
        refetchWorkoutPlan,
        updateWorkoutPlanInDb,
        addWorkoutItemToDb,
        updateWorkoutPlanItemInDb,
        removeWorkoutItemInDb,
    };
};
