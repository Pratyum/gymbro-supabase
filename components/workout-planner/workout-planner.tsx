"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/use-debounce";
import { useWorkoutPlan } from "@/hooks/use-workout-plan";
import { useWorkoutPlanItem } from "@/hooks/use-workout-plan-item";
import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ExerciseSelect from "./exercise-select";
import { SetInputs } from "./set-inputs";

type SortableWorkoutPlanItemCardProps = {
  workoutPlanItem: WorkoutPlanItem & { sets: WorkoutPlanItemSet[] };
  onExerciseChange: (itemId: number, exercise: Exercise) => void;
  onAddSet: (itemId: number) => void;
  onUpdateSet: (itemId: number, setId: number, field: keyof WorkoutPlanItemSet, value: string) => void;
  onRemoveSet: (itemId: number, setId: number) => void;
  onRemoveItem: (itemId: number) => void;
};

function SortableWorkoutPlanItemCard({
    workoutPlanItem,
    onExerciseChange,
    onAddSet,
    onUpdateSet,
    onRemoveSet,
    onRemoveItem,
}: SortableWorkoutPlanItemCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: workoutPlanItem.id });

    const { exerciseData } = useWorkoutPlanItem({ workoutPlanItem });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleExerciseChange = (exercise: Exercise) => {
        onExerciseChange(workoutPlanItem.id, exercise);
    };

    const handleAddSet = () => {
        onAddSet(workoutPlanItem.id);
    };

    const handleUpdateSet = (setId: number, field: keyof WorkoutPlanItemSet, value: string) => {
        onUpdateSet(workoutPlanItem.id, setId, field, value);
    };

    const handleRemoveSet = (setId: number) => {
        onRemoveSet(workoutPlanItem.id, setId);
    };

    const handleRemoveItem = () => {
        onRemoveItem(workoutPlanItem.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <Card className="mb-4" ref={setNodeRef} style={style}>
                <CardHeader className="flex flex-row items-center">
                    <div {...attributes} {...listeners} className="mr-2 cursor-move">
                        <GripVertical className="h-5 w-5 text-gray-500" />
                    </div>
                    <CardTitle className="flex-1">
                        <ExerciseSelect
                            exercise={exerciseData}
                            onExerciseChange={handleExerciseChange}
                        />
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveItem}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {workoutPlanItem.sets.map((set, setIndex) => (
                                <motion.div
                                    key={set.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SetInputs
                                        removeSet={() => handleRemoveSet(set.id)}
                                        setIndex={setIndex}
                                        workoutPlanItemId={workoutPlanItem.id}
                                        debouncedUpdateSet={(setId, field, value) => handleUpdateSet(setId, field, value)}
                                        set={set}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <Button onClick={handleAddSet} variant="outline" size="sm" className="mt-2">
                        Add Set
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

type WorkoutPlannerProps = {
  workoutPlanId: number;
};

export default function WorkoutPlanner({ workoutPlanId }: WorkoutPlannerProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const {
        workoutPlan,
        isWorkoutPlanLoading,
        addWorkoutItemToDb,
        updateWorkoutPlanInDb,
        updateWorkoutPlanItemInDb,
        removeWorkoutItemInDb,
    } = useWorkoutPlan({ workoutPlanId });

    // Local state for optimistic updates
    const [localItems, setLocalItems] = useState(workoutPlan?.items || []);

    // Update local state when data loads
    useMemo(() => {
        if (workoutPlan) {
            setLocalItems(workoutPlan.items || []);
        }
    }, [workoutPlan]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Mutation for updating item order
    const updateOrderMutation = useMutation({
        mutationFn: async (updates: Array<{ id: number; order: number }>) => {
            const promises = updates.map(({ id, order }) => 
                updateWorkoutPlanItemInDb({
                    workoutPlan: { order },
                    workoutPlanItemId: id,
                })
            );
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        },
    });

    // Optimistic handlers
    const handleAddItem = useCallback(async () => {
        const tempId = -Date.now(); // Temporary negative ID
        const newItem = {
            id: tempId,
            workoutPlanId,
            exerciseId: 900,
            order: localItems.length,
            sets: [],
        };

        // Optimistic update
        setLocalItems(prev => [...prev, newItem]);

        try {
            const result = await addWorkoutItemToDb();
            // Replace temp item with real item
            if (result.success && result.data) {
                setLocalItems(prev => 
                    prev.map(item => item.id === tempId ? { ...item, id: result.data[0].id } : item)
                );
            }
        } catch (error) {
            // Revert on error
            setLocalItems(prev => prev.filter(item => item.id !== tempId));
        }
    }, [localItems.length, workoutPlanId, addWorkoutItemToDb]);

    const handleRemoveItem = useCallback((itemId: number) => {
        // Optimistic update
        setLocalItems(prev => prev.filter(item => item.id !== itemId));
        
        // API call
        removeWorkoutItemInDb({ workoutPlanItemId: itemId }).catch(() => {
            // Revert on error (refetch)
            queryClient.invalidateQueries({ queryKey: ["workout-plan", workoutPlanId] });
        });
    }, [removeWorkoutItemInDb, queryClient, workoutPlanId]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setLocalItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = [...items];
            const [movedItem] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, movedItem);

            // Update order for all affected items
            const updates = newItems.map((item, index) => ({
                ...item,
                order: index,
            }));

            // Batch update the order changes
            const orderUpdates = updates
                .filter((item, index) => item.order !== items[index]?.order)
                .map(item => ({ id: item.id, order: item.order }));

            if (orderUpdates.length > 0) {
                updateOrderMutation.mutate(orderUpdates);
            }

            return updates;
        });
    }, [updateOrderMutation]);

    // Local state update handlers
    const handleExerciseChange = useCallback((itemId: number, exercise: Exercise) => {
        setLocalItems(prev => 
            prev.map(item => 
                item.id === itemId ? { ...item, exerciseId: exercise.id } : item
            )
        );

        // Debounced API call
        updateWorkoutPlanItemInDb({
            workoutPlan: { exerciseId: exercise.id },
            workoutPlanItemId: itemId,
        });
    }, [updateWorkoutPlanItemInDb]);

    const handleAddSet = useCallback((itemId: number) => {
        const newSet = {
            id: -Date.now(),
            workoutPlanItemId: itemId,
            weight: "10",
            reps: "10",
            rest: "30",
        };

        setLocalItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, sets: [...item.sets, newSet] }
                    : item
            )
        );

        // API call
        fetch(`/api/workout-plan/${workoutPlanId}/${itemId}`, {
            method: "POST",
            body: JSON.stringify({
                weight: "10",
                reps: "10",
                rest: "30",
            }),
        }).then(res => res.json()).then(data => {
            if (data.success) {
                // Update with real ID
                setLocalItems(prev =>
                    prev.map(item =>
                        item.id === itemId
                            ? {
                                ...item,
                                sets: item.sets.map(set =>
                                    set.id === newSet.id ? { ...set, id: data.data[0].id } : set
                                )
                            }
                            : item
                    )
                );
            }
        });
    }, [workoutPlanId]);

    const debouncedUpdateSet = useDebounce(
        async (itemId: number, setId: number, field: keyof WorkoutPlanItemSet, value: string) => {
            fetch(`/api/workout-plan/${workoutPlanId}/${itemId}/${setId}`, {
                method: "PATCH",
                body: JSON.stringify({ [field]: value }),
            });
        },
        500
    );

    const handleUpdateSet = useCallback((itemId: number, setId: number, field: keyof WorkoutPlanItemSet, value: string) => {
        // Optimistic update
        setLocalItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        sets: item.sets.map(set =>
                            set.id === setId ? { ...set, [field]: value } : set
                        )
                    }
                    : item
            )
        );

        // Debounced API call
        debouncedUpdateSet(itemId, setId, field, value);
    }, [debouncedUpdateSet]);

    const handleRemoveSet = useCallback((itemId: number, setId: number) => {
        // Optimistic update
        setLocalItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, sets: item.sets.filter(set => set.id !== setId) }
                    : item
            )
        );

        // API call
        fetch(`/api/workout-plan/${workoutPlanId}/${itemId}/${setId}`, {
            method: "DELETE",
        });
    }, [workoutPlanId]);

    const finishPlanning = async () => {
        router.push(`/workouts`);
    };
    const [planName, setPlanName] = useState(workoutPlan?.friendlyName || "New Workout Plan");
    
    const handleNameChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setPlanName(newName);
        
        await updateWorkoutPlanInDb({ friendlyName: newName });
    }, [updateWorkoutPlanInDb]);

    if (isWorkoutPlanLoading) {
        return <div>Loading...</div>;
    }

    if (!workoutPlan) {
        return <div>Workout Plan not found</div>;
    }


    return (
        <motion.div 
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className="flex flex-col md:flex-row md:items-center justify-between mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                    <Label htmlFor="plan-name" className="block text-sm font-medium mb-1">
                        Workout Name
                    </Label>
                    <Input
                        type="text"
                        id="plan-name"
                        value={planName}
                        onChange={handleNameChange}
                        className="w-full"
                        placeholder="Enter workout plan name"
                    />
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button onClick={handleAddItem} className="whitespace-nowrap">
                        <Plus className="mr-2 h-4 w-4" /> Add Exercise
                    </Button>
                </motion.div>
            </motion.div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={localItems.map(item => ({ id: item.id }))}
                    strategy={verticalListSortingStrategy}
                >
                    <AnimatePresence mode="popLayout">
                        {localItems.map((workoutPlanItem) => (
                            <SortableWorkoutPlanItemCard
                                key={workoutPlanItem.id}
                                workoutPlanItem={workoutPlanItem}
                                onExerciseChange={handleExerciseChange}
                                onAddSet={handleAddSet}
                                onUpdateSet={handleUpdateSet}
                                onRemoveSet={handleRemoveSet}
                                onRemoveItem={handleRemoveItem}
                            />
                        ))}
                    </AnimatePresence>
                </SortableContext>
            </DndContext>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6"
            >
                <Button onClick={finishPlanning} className="w-full sm:w-auto">
                    Finish Planning
                </Button>
            </motion.div>
        </motion.div>
    );
}