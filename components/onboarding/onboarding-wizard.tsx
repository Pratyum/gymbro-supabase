"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useOnboardingWizard } from "@/hooks/use-onboarding-wizard";
import { ClientSelectionStep } from "./steps/client-selection-step";
import { GoalsSetupStep } from "./steps/goals-setup";
import { WorkoutScheduleStep } from "./steps/workout-schedule-step";
import { ProgramDurationStep } from "./steps/program-duration-step";
import { ReviewStep } from "./steps/review-step";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface OnboardingWizardProps {
    onClose: () => void;
}

const STEPS = [
    { title: "Select Client", description: "Choose who to onboard" },
    { title: "Daily Goals", description: "Set health targets" },
    { title: "Weekly Schedule", description: "Plan workout routine" },
    { title: "Program Details", description: "Set duration & start date" },
    { title: "Review", description: "Confirm & create" },
];

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const {
        state,
        updateState,
        nextStep,
        prevStep,
        goToStep,
        resetWizard,
        canProceedToNext,
        createProgram,
        createError,
    } = useOnboardingWizard();

    const progress = ((state.step + 1) / STEPS.length) * 100;

    const handleComplete = async () => {
        setIsCreating(true);
        try {
            await createProgram(state);
            toast({
                title: "Success!",
                description: `Training program created for ${state.client?.name}`,
            });
            onClose();
            router.push("/admin/programs"); // Navigate to programs page
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create program",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleNext = () => {
        if (state.step === 4) {
            handleComplete();
        } else {
            nextStep();
        }
    };

    const stepProps = {
        data: state,
        onUpdate: updateState,
        onNext: handleNext,
        onPrev: prevStep,
    };

    const renderStep = () => {
        switch (state.step) {
        case 0:
            return <ClientSelectionStep {...stepProps} />;
        case 1:
            return <GoalsSetupStep {...stepProps} />;
        case 2:
            return <WorkoutScheduleStep {...stepProps} />;
        case 3:
            return <ProgramDurationStep {...stepProps} />;
        case 4:
            return <ReviewStep {...stepProps} />;
        default:
            return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
                <Card className="h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                        {/* Header */}
                        <div className="border-b p-6 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold">Client Onboarding</h1>
                                    <p className="text-muted-foreground">
                                        Create a personalized training program
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Step {state.step + 1} of {STEPS.length}</span>
                                    <span>{Math.round(progress)}% Complete</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            {/* Step Navigation */}
                            <div className="flex gap-2 mt-4 overflow-x-auto">
                                {STEPS.map((step, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            index === state.step
                                                ? "default"
                                                : index < state.step
                                                    ? "secondary"
                                                    : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => goToStep(index)}
                                        className="whitespace-nowrap"
                                        disabled={index > state.step}
                                    >
                                        {index < state.step && (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        <span className="hidden sm:inline">{step.title}</span>
                                        <span className="sm:hidden">{index + 1}</span>
                                    </Button>
                                ))}
                            </div>

                            {/* Current Step Info */}
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{STEPS[state.step].title}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {STEPS[state.step].description}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={state.step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Error Display */}
                        {createError && (
                            <div className="border-t p-4 bg-destructive/10">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm">
                                        {createError instanceof Error ? createError.message : "An error occurred"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="border-t p-6 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    {state.client ? `Creating program for ${state.client.name}` : "Select a client to continue"}
                                </div>
                                <div className="flex gap-3">
                                    {state.step > 0 && (
                                        <Button variant="outline" onClick={prevStep} disabled={isCreating}>
                                            Previous
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        disabled={!canProceedToNext || isCreating}
                                        className={state.step === 4 ? "bg-green-600 hover:bg-green-700" : ""}
                                    >
                                        {isCreating ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                                                />
                                                Creating...
                                            </>
                                        ) : state.step === 4 ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Create Program
                                            </>
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}