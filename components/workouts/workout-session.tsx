"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    PlayCircle,
    PauseCircle,
    RotateCcw,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { WorkoutSessionWithPlan } from "@/types";
import { SelectExercise } from "@/utils/db/schema";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { ExerciseNameBar } from "./exercise-name-bar";
import { ExerciseRow } from "./exercise-row";

type WorkoutPageProps = {
  sessionId: number;
  workoutSession: WorkoutSessionWithPlan;
  exerciseDataMap: Record<number, SelectExercise>;
};

const StartWorkout = ({
    friendlyName,
    startWorkout,
}: {
  friendlyName?: string;
  startWorkout: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-8"
        >
            <h1 className="text-5xl font-bold text-primary mb-8">
                {friendlyName ?? "Session"}
            </h1>
            <Button
                onClick={startWorkout}
                className="py-4 px-8 text-2xl rounded-full"
            >
        Start Workout
            </Button>
        </motion.div>
    );
};

const Timer = ({
    timer,
    toggleTimer,
    isTimerRunning,
    resetTimer,
}: {
  timer: number;
  toggleTimer: () => void;
  isTimerRunning: boolean;
  resetTimer: () => void;
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="my-8 flex items-center gap-4 self-end">
            <div className="text-4xl font-bold text-accent-foreground">
                {formatTime(timer)}
            </div>
            <div>
                <Button
                    onClick={toggleTimer}
                    variant="outline"
                    className="mr-4 bg-gray-800 hover:bg-gray-700 text-white"
                >
                    {isTimerRunning ? (
                        <PauseCircle size={24} />
                    ) : (
                        <PlayCircle size={24} />
                    )}
                </Button>
                <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    <RotateCcw size={24} />
                </Button>
            </div>
        </div>
    );
};

export default function WorkoutPage({
    sessionId,
    workoutSession,
    exerciseDataMap,
}: WorkoutPageProps) {
    const {
        isWorkoutSessionLoading,
        addWorkoutSessionItemLogToDb,
        workoutSession: session,
        startWorkoutSession,
        exercises,
        currentExerciseIndex,
        resetWorkoutSession,
        nextExercise,
        previousExercise,
    } = useWorkoutSession({
        workoutSessionId: workoutSession.id,
    });
    const exercisesWithInfo = exercises.map((exerciseId: number) => {
        return {
            ...exerciseDataMap[exerciseId],
            sets: workoutSession.workoutPlan?.items.find(
                (item) => item.exerciseId === exerciseId,
            )?.sets??[],
        };
    });
    console.log({ session, exercises, exercisesWithInfo });
    const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const [direction, setDirection] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const startWorkout = async () => {
        setIsWorkoutStarted(true);
        await startWorkoutSession();
    };

    const toggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const resetWorkout = () => {
        setIsWorkoutStarted(false);
        setTimer(0);
        setIsTimerRunning(false);
        resetWorkoutSession();
    };

    const updateActualReps = (
        exerciseIndex: number,
        setIndex: number,
        value: number,
    ) => {
        if(!exercisesWithInfo[exerciseIndex].sets![setIndex].id) return;
        addWorkoutSessionItemLogToDb({
            workoutPlanItemSetId: exercisesWithInfo[exerciseIndex].sets![setIndex].id,
            actualReps: value.toString(),
            isCompleted: "true",
        });
    };

    const updateActualWeight = (
        exerciseIndex: number,
        setIndex: number,
        value: number,
    ) => {
        if(!exercisesWithInfo[exerciseIndex].sets![setIndex].id) return;
        addWorkoutSessionItemLogToDb({
            workoutPlanItemSetId: exercisesWithInfo[exerciseIndex].sets![setIndex].id,
            actualWeight: value.toString(),
            isCompleted: "true",
        });
    };

    const pageVariants = {
        initial: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? 1000 : -1000,
        }),
        in: {
            opacity: 1,
            x: 0,
        },
        out: (direction: number) => ({
            opacity: 0,
            x: direction < 0 ? 1000 : -1000,
        }),
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5,
    };

    return (
        <div className="w-full flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full rounded-lg overflow-hidden flex flex-col"
            >
                {!isWorkoutStarted ? (
                    <StartWorkout
                        friendlyName={workoutSession.workoutPlan?.friendlyName!}
                        startWorkout={startWorkout}
                    />
                ) : (
                    <>
                        <Timer
                            timer={timer}
                            toggleTimer={toggleTimer}
                            isTimerRunning={isTimerRunning}
                            resetTimer={resetWorkout}
                        />
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={currentExerciseIndex}
                                custom={direction}
                                variants={pageVariants}
                                initial="initial"
                                animate="in"
                                exit="out"
                                transition={pageTransition}
                                className="h-full flex flex-col p-8"
                            >
                                <ExerciseNameBar exercise={exercisesWithInfo[currentExerciseIndex]} />
                                <div className="flex-grow space-y-6 overflow-auto">
                                    {Array.from({
                                        length:
                      exercisesWithInfo[currentExerciseIndex].sets?.length ?? 0,
                                    }).map((_, setIndex) => (
                                        <motion.div
                                            key={setIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: setIndex * 0.1 }}
                                            className="flex items-center justify-between bg-slate-600 bg-opacity-30 p-4 rounded-lg"
                                        >
                                            <ExerciseRow
                                                setIndex={setIndex}
                                                expectedWeight={parseInt(exercisesWithInfo[currentExerciseIndex].sets![setIndex].weight!, 10)}
                                                actualWeight={parseInt(exercisesWithInfo[currentExerciseIndex].sets![setIndex].weight!, 10)}
                                                expectedReps={parseInt(exercisesWithInfo[currentExerciseIndex].sets![setIndex].reps!, 10)} 
                                                actualReps={parseInt(exercisesWithInfo[currentExerciseIndex].sets![setIndex].reps!,10)}
                                                updateActualReps={(setIndex, value) => updateActualReps(currentExerciseIndex, setIndex, value)}
                                                updateActualWeight={(setIndex, value) => updateActualWeight(currentExerciseIndex, setIndex, value)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button
                                        onClick={() => {
                                            previousExercise();
                                            setDirection(-1);
                                        }}
                                        disabled={currentExerciseIndex === 0}
                                        className="text-xl py-3 px-6"
                                    >
                                        <ChevronLeft className="mr-2" size={24} />
                    Previous
                                    </Button>
                                    <Button onClick={() => {
                                        nextExercise();
                                        setDirection(1);
                                    }} className="text-xl py-3 px-6">
                                        {currentExerciseIndex === exercises.length - 1
                                            ? "Finish"
                                            : "Next"}
                                        {currentExerciseIndex < exercises.length - 1 && (
                                            <ChevronRight className="ml-2" size={24} />
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
                {isWorkoutStarted && (
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%`,
                        }}
                        className="h-2"
                    />
                )}
            </motion.div>
            
        </div>
    );
}
