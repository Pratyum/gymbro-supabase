"use client";

import { motion } from "framer-motion";
import { Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OnboardingState } from "@/types";
import { WorkoutDaySelector } from "./workout-day-selector";

interface StepProps {
    data: OnboardingState;
    onUpdate: (updates: Partial<OnboardingState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

interface WorkoutPlan {
    id: number;
    friendlyName: string;
    userId: number;
}

export function WorkoutScheduleStep({ data, onUpdate, onNext, onPrev }: StepProps) {
    // Mock workout plans - in real app, this would come from API
    const workoutPlans: WorkoutPlan[] = [
        { id: 1, friendlyName: "Upper Body Strength", userId: 1 },
        { id: 2, friendlyName: "Lower Body Power", userId: 1 },
        { id: 3, friendlyName: "Full Body Circuit", userId: 1 },
        { id: 4, friendlyName: "Cardio Blast", userId: 1 },
        { id: 5, friendlyName: "Core & Flexibility", userId: 1 },
    ];

    const handleProgramUpdate = (field: keyof typeof data.program, value: any) => {
        onUpdate({
            program: {
                ...data.program,
                [field]: value,
            },
        });
    };

    const handleDaysChange = (days: number[]) => {
        handleProgramUpdate('scheduleDays', days);
    };

    const selectedPlan = workoutPlans.find(plan => plan.id === data.program.workoutPlanId);
    const scheduledDaysCount = data.program.scheduleDays?.length || 0;
    const canProceed = (data.program.createNewPlan || data.program.workoutPlanId) && scheduledDaysCount > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Workout Plan & Schedule</h2>
                <p className="text-muted-foreground">
                    Choose a workout plan and schedule for {data.client?.name}
                </p>
            </div>

            {/* Workout Plan Selection */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <Dumbbell className="h-6 w-6 text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold">Workout Plan</h3>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Select an existing plan or create a new one
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={!data.program.createNewPlan ? 'default' : 'outline'}
                                onClick={() => handleProgramUpdate('createNewPlan', false)}
                                className="flex-1"
                            >
                                Use Existing Plan
                            </Button>
                            <Button
                                variant={data.program.createNewPlan ? 'default' : 'outline'}
                                onClick={() => {
                                    handleProgramUpdate('createNewPlan', true);
                                    handleProgramUpdate('workoutPlanId', undefined);
                                }}
                                className="flex-1"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Plan
                            </Button>
                        </div>

                        {!data.program.createNewPlan ? (
                            <div>
                                <Label htmlFor="workout-plan" className="text-sm font-medium">
                                    Select Workout Plan
                                </Label>
                                <Select
                                    value={data.program.workoutPlanId?.toString()}
                                    onValueChange={(value) => handleProgramUpdate('workoutPlanId', parseInt(value))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Choose a workout plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workoutPlans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id.toString()}>
                                                {plan.friendlyName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedPlan && (
                                    <div className="mt-2 p-3 bg-background rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <Dumbbell className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">{selectedPlan.friendlyName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Label htmlFor="new-plan-name" className="text-sm font-medium">
                                    New Plan Name
                                </Label>
                                <Input
                                    id="new-plan-name"
                                    placeholder="e.g., Custom Strength Program"
                                    value={data.program.name}
                                    onChange={(e) => handleProgramUpdate('name', e.target.value)}
                                    className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    You can add exercises to this plan after creating the program
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Schedule Days */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <WorkoutDaySelector
                    selectedDays={data.program.scheduleDays || []}
                    onDaysChange={handleDaysChange}
                    title="Schedule Days"
                    description="Which days should workouts be scheduled?"
                    showPresets={true}
                />
            </motion.div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev}>
                    Previous
                </Button>
                <Button 
                    onClick={onNext} 
                    disabled={!canProceed}
                    className="gap-2"
                >
                    Continue to Program Details
                </Button>
            </div>
        </motion.div>
    );
}