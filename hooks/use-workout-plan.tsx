"use client";

import {
    WorkoutPlan,
    WorkoutPlanItem,
    WorkoutPlanWithItemsAndSets,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type WorkoutPlanProps = {
  workoutPlanId: number;
};

export const useWorkoutPlan = ({ workoutPlanId }: WorkoutPlanProps) => {
    const queryClient = useQueryClient();
    
    const {
        data: workoutPlan,
        isLoading: isWorkoutPlanLoading,
        error,
    } = useQuery({
        queryKey: ["workout-plan", workoutPlanId],
        queryFn: async () => {
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
                credentials: "include",
            });
            const data = (await response.json()).data;
            return data as WorkoutPlanWithItemsAndSets;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update workout plan mutation
    const updateWorkoutPlanMutation = useMutation({
        mutationFn: async (payload: Partial<WorkoutPlan>) => {
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update");
            return data;
        },
        onMutate: async (payload) => {
            // Cancel any outgoing queries
            await queryClient.cancelQueries({ queryKey: ["workout-plan", workoutPlanId] });
            
            // Snapshot the previous value
            const previousWorkoutPlan = queryClient.getQueryData<WorkoutPlanWithItemsAndSets>(["workout-plan", workoutPlanId]);
            
            // Optimistically update to the new value
            if (previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], {
                    ...previousWorkoutPlan,
                    ...payload,
                });
            }
            
            return { previousWorkoutPlan };
        },
        onError: (err, payload, context) => {
            // Roll back on error
            if (context?.previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], context.previousWorkoutPlan);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        },
    });

    // Add workout item mutation
    const addWorkoutItemMutation = useMutation({
        mutationFn: async () => {
            const payload: Omit<WorkoutPlanItem, "id"> = {
                exerciseId: 900,
                workoutPlanId: workoutPlanId,
                order: workoutPlan?.items.length ?? 0,
            };
            const response = await fetch(`/api/workout-plan/${workoutPlanId}`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add item");
            return data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["workout-plan", workoutPlanId] });
            
            const previousWorkoutPlan = queryClient.getQueryData<WorkoutPlanWithItemsAndSets>(["workout-plan", workoutPlanId]);
            
            if (previousWorkoutPlan) {
                const newItem = {
                    id: -Date.now(), // Temporary ID
                    exerciseId: 900,
                    workoutPlanId: workoutPlanId,
                    order: previousWorkoutPlan.items.length,
                    sets: [],
                };
                
                queryClient.setQueryData(["workout-plan", workoutPlanId], {
                    ...previousWorkoutPlan,
                    items: [...previousWorkoutPlan.items, newItem],
                });
            }
            
            return { previousWorkoutPlan };
        },
        onError: (err, variables, context) => {
            if (context?.previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], context.previousWorkoutPlan);
            }
        },
        onSuccess: (data) => {
            // Refetch to ensure we have the correct server state
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        },
    });

    // Remove workout item mutation
    const removeWorkoutItemMutation = useMutation({
        mutationFn: async ({ workoutPlanItemId }: { workoutPlanItemId: number }) => {
            const response = await fetch(
                `/api/workout-plan/${workoutPlanId}/${workoutPlanItemId}`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to remove item");
            return data;
        },
        onMutate: async ({ workoutPlanItemId }) => {
            await queryClient.cancelQueries({ queryKey: ["workout-plan", workoutPlanId] });
            
            const previousWorkoutPlan = queryClient.getQueryData<WorkoutPlanWithItemsAndSets>(["workout-plan", workoutPlanId]);
            
            if (previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], {
                    ...previousWorkoutPlan,
                    items: previousWorkoutPlan.items.filter(item => item.id !== workoutPlanItemId),
                });
            }
            
            return { previousWorkoutPlan };
        },
        onError: (err, variables, context) => {
            if (context?.previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], context.previousWorkoutPlan);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        },
    });

    // Update workout plan item mutation
    const updateWorkoutPlanItemMutation = useMutation({
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
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(workoutPlan),
                },
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update item");
            return data;
        },
        onMutate: async ({ workoutPlanItemId, workoutPlan: updates }) => {
            await queryClient.cancelQueries({ queryKey: ["workout-plan", workoutPlanId] });
            
            const previousWorkoutPlan = queryClient.getQueryData<WorkoutPlanWithItemsAndSets>(["workout-plan", workoutPlanId]);
            
            if (previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], {
                    ...previousWorkoutPlan,
                    items: previousWorkoutPlan.items.map(item =>
                        item.id === workoutPlanItemId
                            ? { ...item, ...updates }
                            : item
                    ),
                });
            }
            
            return { previousWorkoutPlan };
        },
        onError: (err, variables, context) => {
            if (context?.previousWorkoutPlan) {
                queryClient.setQueryData(["workout-plan", workoutPlanId], context.previousWorkoutPlan);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        },
    });

    return {
        isWorkoutPlanLoading,
        workoutPlan,
        error,
        updateWorkoutPlanInDb: updateWorkoutPlanMutation.mutateAsync,
        addWorkoutItemToDb: addWorkoutItemMutation.mutateAsync,
        updateWorkoutPlanItemInDb: updateWorkoutPlanItemMutation.mutateAsync,
        removeWorkoutItemInDb: removeWorkoutItemMutation.mutateAsync,
        refetchWorkoutPlan: () => queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] }),
    };
};