import { useWorkoutPlanItem } from "@/hooks/use-workout-plan-item";
import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

export function SortableWorkoutPlanItemCard({
    workoutPlanItem,
    onExerciseChange,
    onAddSet,
    onUpdateSet,
    onRemoveSet,
    onRemoveItem,
}: SortableWorkoutPlanItemCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: workoutPlanItem.id });

    const memoizedWorkoutPlanItem = useMemo(() => workoutPlanItem, [workoutPlanItem]);

    // Use the hook for this specific workout plan item
    const {
        exerciseData,
        addSetToDb,
        updateSetToDb,
        removeSetFromDb,
    } = useWorkoutPlanItem({ workoutPlanItem });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleExerciseChange = (exercise: Exercise) => {
        // Directly update in the database using the hook
        onExerciseChange(workoutPlanItem.id, exercise);
    };

    const handleAddSet = async () => {
        // Use the hook's function to add a set
        const result = await addSetToDb();
        if (result.success) {
            onAddSet(workoutPlanItem.id);
        }
    };

    const handleUpdateSet = (setId: number, field: keyof WorkoutPlanItemSet, value: string) => {
        // Update the set in the database using the hook
        updateSetToDb({
            id: setId,
            [field]: value,
        });

        // Also update local state
        onUpdateSet(workoutPlanItem.id, setId, field, value);
    };

    const handleRemoveSet = async (setId: number) => {
        // Remove the set from the database using the hook
        const result = await removeSetFromDb(setId);
        if (result.success) {
            onRemoveSet(workoutPlanItem.id, setId);
        }
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
                            {memoizedWorkoutPlanItem.sets.map((set, setIndex) => (
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