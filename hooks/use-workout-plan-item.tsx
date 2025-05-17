"use client";

import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type WorkoutPlanItemProps = {
  workoutPlanItem: WorkoutPlanItem & { sets: WorkoutPlanItemSet[] };
};

export const useWorkoutPlanItem = ({
    workoutPlanItem,
}: WorkoutPlanItemProps) => {
    const queryClient = useQueryClient();
    
    // Fetch exercise data
    const { data: exerciseData, isLoading: isExerciseLoading } = useQuery({
        queryKey: ["exercise", workoutPlanItem.exerciseId],
        queryFn: async () => {
            const response = await fetch(
                `/api/exercise/${workoutPlanItem.exerciseId}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch exercise data');
            }
            const data = (await response.json()).data;
            return data as Exercise;
        },
        // Only fetch if we have a valid exercise ID
        enabled: !!workoutPlanItem.exerciseId && workoutPlanItem.exerciseId > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update workout plan item mutation
    const updateWorkoutPlanItemMutation = useMutation({
        mutationFn: async (payload: Partial<WorkoutPlanItem>) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to update workout plan item');
            }
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ 
                queryKey: ["workout-plan", workoutPlanItem.workoutPlanId] 
            });
        },
    });

    // Add set mutation
    const addSetMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        weight: "10",
                        reps: "10",
                        rest: "30",
                    }),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to add set');
            }
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ 
                queryKey: ["workout-plan", workoutPlanItem.workoutPlanId] 
            });
        },
    });

    // Update set mutation
    const updateSetMutation = useMutation({
        mutationFn: async ({
            id,
            ...payload
        }: Partial<WorkoutPlanItemSet> & { id: number }) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}/${id}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to update set');
            }
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ 
                queryKey: ["workout-plan", workoutPlanItem.workoutPlanId] 
            });
        },
    });

    // Remove set mutation
    const removeSetMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanItem.workoutPlanId}/${workoutPlanItem.id}/${id}`,
                {
                    credentials: "include",
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error('Failed to remove set');
            }
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ 
                queryKey: ["workout-plan", workoutPlanItem.workoutPlanId] 
            });
        },
    });

    return {
        exerciseData,
        isExerciseLoading,
        updateWorkoutPlanItemInDb: updateWorkoutPlanItemMutation.mutateAsync,
        addSetToDb: addSetMutation.mutateAsync,
        updateSetToDb: updateSetMutation.mutateAsync,
        removeSetFromDb: removeSetMutation.mutateAsync,
    };
};