"use client";

import { useState, useCallback } from "react";
import { OnboardingState } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const INITIAL_STATE: OnboardingState = {
    step: 0,
    client: undefined,
    goals: {
        stepsGoal: 10000,
        waterGoal: 8,
        sleepGoal: 8,
    },
    program: {
        name: "",
        description: "",
        durationWeeks: 4,
        startDate: new Date(),
        workoutPlanId: undefined,
        createNewPlan: false,
        scheduleDays: [],
    },
};

export function useOnboardingWizard() {
    const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

    // Get all members for client selection
    const { data: members, isLoading: membersLoading } = useQuery({
        queryKey: ["members"],
        queryFn: async () => {
            const response = await fetch("/api/users?role=member", {
                credentials: "include",
            });
            const data = await response.json();
            return data.data || [];
        },
    });

    // Get workout plans for selection
    const { data: workoutPlans, isLoading: workoutPlansLoading } = useQuery({
        queryKey: ["workout-plans"],
        queryFn: async () => {
            const response = await fetch("/api/workout-plan", {
                credentials: "include",
            });
            const data = await response.json();
            return data.data || [];
        },
    });

    // Create simplified program mutation
    const createProgramMutation = useMutation({
        mutationFn: async (data: OnboardingState) => {
            if (!data.client) throw new Error("No client selected");

            // 1. Create daily goals
            const goalsResponse = await fetch("/api/goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId: data.client.id,
                    stepsGoal: data.goals.stepsGoal,
                    waterGoal: data.goals.waterGoal,
                    sleepGoal: data.goals.sleepGoal,
                }),
            });

            if (!goalsResponse.ok) {
                throw new Error("Failed to create daily goals");
            }

            // 2. Handle workout plan creation or selection
            let workoutPlanId = data.program.workoutPlanId;
            
            if (data.program.createNewPlan) {
                // Create new workout plan
                const planResponse = await fetch("/api/workout-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        userId: data.client.id,
                        friendlyName: data.program.name,
                        frequency: data.program.scheduleDays, // Use existing frequency field
                        startDate: data.program.startDate,
                    }),
                });

                if (!planResponse.ok) {
                    throw new Error("Failed to create workout plan");
                }

                const planData = await planResponse.json();
                workoutPlanId = planData.data[0].id;
            } else {
                // Update existing workout plan with new schedule
                if (!workoutPlanId) throw new Error("No workout plan selected");
                
                await fetch(`/api/workout-plan/${workoutPlanId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        frequency: data.program.scheduleDays,
                        startDate: data.program.startDate,
                    }),
                });
            }

            // 3. Create program metadata
            const metadataResponse = await fetch("/api/program-metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    workoutPlanId,
                    assignedTo: data.client.id,
                    programName: data.program.name,
                    description: data.program.description,
                    durationWeeks: data.program.durationWeeks,
                    startDate: data.program.startDate,
                }),
            });

            if (!metadataResponse.ok) {
                throw new Error("Failed to create program metadata");
            }

            // 4. Trigger workout session creation using existing logic
            const sessionsResponse = await fetch(`/api/crons/update-workout-session?userId=${data.client.id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!sessionsResponse.ok) {
                throw new Error("Failed to create workout sessions");
            }

            return { success: true };
        },
    });

    const updateState = useCallback((updates: Partial<OnboardingState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const nextStep = useCallback(() => {
        setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
    }, []);

    const prevStep = useCallback(() => {
        setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
    }, []);

    const goToStep = useCallback((step: number) => {
        setState(prev => ({ ...prev, step: Math.max(0, Math.min(step, 4)) }));
    }, []);

    const resetWizard = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    const canProceedToNext = useCallback(() => {
        switch (state.step) {
        case 0: // Client selection
            return !!state.client;
        case 1: // Goals setup
            return state.goals.stepsGoal > 0 && state.goals.waterGoal > 0 && state.goals.sleepGoal > 0;
        case 2: // Workout plan & schedule
            const hasPlan = state.program.createNewPlan || state.program.workoutPlanId;
            const hasSchedule = state.program.scheduleDays.length > 0;
            return hasPlan && hasSchedule;
        case 3: // Program duration
            return state.program.name.trim() !== "" && state.program.durationWeeks > 0;
        case 4: // Review
            return true;
        default:
            return false;
        }
    }, [state]);

    const isLoading = membersLoading || workoutPlansLoading || createProgramMutation.isPending;

    return {
        state,
        updateState,
        nextStep,
        prevStep,
        goToStep,
        resetWizard,
        canProceedToNext: canProceedToNext(),
        members: members || [],
        workoutPlans: workoutPlans || [],
        createProgram: createProgramMutation.mutateAsync,
        isLoading,
        isCreating: createProgramMutation.isPending,
        createError: createProgramMutation.error,
    };
}