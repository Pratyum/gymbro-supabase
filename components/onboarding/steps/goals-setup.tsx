"use client";

import { motion } from "framer-motion";
import { Target, Droplets, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepProps } from "@/types";

export function GoalsSetupStep({ data, onUpdate, onNext, onPrev }: StepProps) {
    const handleGoalChange = (goalType: keyof typeof data.goals, value: number) => {
        onUpdate({
            goals: {
                ...data.goals,
                [goalType]: value,
            },
        });
    };

    const goalConfigs = [
        {
            key: "stepsGoal" as const,
            title: "Daily Steps",
            description: "Target number of steps per day",
            icon: Target,
            value: data.goals.stepsGoal,
            unit: "steps",
            min: 1000,
            max: 50000,
            step: 1000,
            color: "text-blue-600",
            bgColor: "bg-blue-50 border-blue-200",
        },
        {
            key: "waterGoal" as const,
            title: "Water Intake",
            description: "Target glasses of water per day",
            icon: Droplets,
            value: data.goals.waterGoal,
            unit: "glasses",
            min: 1,
            max: 20,
            step: 1,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50 border-cyan-200",
        },
        {
            key: "sleepGoal" as const,
            title: "Sleep Duration",
            description: "Target hours of sleep per night",
            icon: Moon,
            value: data.goals.sleepGoal,
            unit: "hours",
            min: 4,
            max: 12,
            step: 0.5,
            color: "text-purple-600",
            bgColor: "bg-purple-50 border-purple-200",
        },
    ];

    const canProceed = data.goals.stepsGoal > 0 && data.goals.waterGoal > 0 && data.goals.sleepGoal > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Set Daily Goals</h2>
                <p className="text-muted-foreground">
                    Define health and fitness targets for {data.client?.name}
                </p>
            </div>

            <div className="grid gap-6">
                {goalConfigs.map((goal, index) => (
                    <motion.div
                        key={goal.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card className={`${goal.bgColor} border-2`}>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <goal.icon className={`h-6 w-6 ${goal.color}`} />
                                    <div>
                                        <h3 className="text-lg font-semibold">{goal.title}</h3>
                                        <p className="text-sm text-muted-foreground font-normal">
                                            {goal.description}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor={goal.key} className="text-sm font-medium">
                                            Target Amount
                                        </Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                id={goal.key}
                                                type="number"
                                                min={goal.min}
                                                max={goal.max}
                                                step={goal.step}
                                                value={goal.value}
                                                onChange={(e) => handleGoalChange(goal.key, parseFloat(e.target.value) || 0)}
                                                className="text-center font-semibold"
                                            />
                                            <span className="text-sm text-muted-foreground min-w-0">
                                                {goal.unit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${goal.color}`}>
                                            {goal.value}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {goal.unit}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleGoalChange(goal.key, Math.max(goal.min, goal.value - goal.step))}
                                        disabled={goal.value <= goal.min}
                                    >
                                        -
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleGoalChange(goal.key, Math.min(goal.max, goal.value + goal.step))}
                                        disabled={goal.value >= goal.max}
                                    >
                                        +
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev}>
                    Previous
                </Button>
                <Button 
                    onClick={onNext} 
                    disabled={!canProceed}
                    className="gap-2"
                >
                    Continue to Schedule
                </Button>
            </div>
        </motion.div>
    );
}