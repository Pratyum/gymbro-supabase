"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExerciseSelect from "./exercise-select";

import { DayOfWeek, WorkoutFrequencyToggle } from "./workout-frequency-toggle";
import { useWorkoutPlanItem } from "@/hooks/use-workout-plan-item";
import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { useWorkoutPlan } from "@/hooks/use-workout-plan";

type SortableWorkoutPlanItemCardProps = {
  workoutPlanItem: WorkoutPlanItem & { sets: WorkoutPlanItemSet[] };
  refreshWorkoutPlan: () => void;
  removeWorkoutPlanItem: (workoutPlanItem: WorkoutPlanItem) => void;
};
function SortableWorkoutPlanItemCard({
  workoutPlanItem,
  refreshWorkoutPlan,
  removeWorkoutPlanItem,
}: SortableWorkoutPlanItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: workoutPlanItem.id });

  const {
    exerciseData,
    addSetToDb,
    updateSetToDb,
    removeSetFromDb,
    updateWorkoutPlanItemInDb,
  } = useWorkoutPlanItem({ workoutPlanItem });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onExerciseChange = async (exercise: Exercise) => {
    await updateWorkoutPlanItemInDb({
      ...workoutPlanItem,
      exerciseId: exercise.id,
    });
    refreshWorkoutPlan();
  };

  const addSet = async () => {
    await addSetToDb();
    refreshWorkoutPlan();
  };

  const updateSet = async (
    setId: number,
    field: keyof WorkoutPlanItemSet,
    value: string
  ) => {
    await updateSetToDb({
      id: setId,
      [field]: value,
    });
    refreshWorkoutPlan();
  };

  const updateReps = async (workoutItemSetId: number, reps: number) => {
    await updateSet(workoutItemSetId, "reps", reps.toString());
  };

  const updateWeight = async (workoutItemSetId: number, weight: number) => {
    await updateSet(workoutItemSetId, "weight", weight.toString());
  };

  const updateRest = async (workoutItemSetId: number, rest: number) => {
    await updateSet(workoutItemSetId, "rest", rest.toString());
  };

  const removeSet = async (workoutItemSetId: number) => {
    await removeSetFromDb(workoutItemSetId);
    refreshWorkoutPlan();
  };

  return (
    <Card className="mb-4" ref={setNodeRef} style={style}>
      <CardHeader className="flex flex-row items-center">
        <div {...attributes} {...listeners} className="mr-2 cursor-move">
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <CardTitle className="flex-1">
          <ExerciseSelect
            exercise={exerciseData}
            onExerciseChange={onExerciseChange}
          />
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeWorkoutPlanItem(workoutPlanItem)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {workoutPlanItem.sets.map((set, setIndex) => (
            <div key={set.id} className="flex items-center justify-evenly">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}-reps`}
                  className="w-16"
                >
                  Set {setIndex + 1}
                </Label>
                <Input
                  id={`set-${workoutPlanItem.id}-${set.id}-reps`}
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    updateReps(set.id, parseInt(e.target.value, 10))
                  }
                  min={1}
                  className="w-20"
                />
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}-reps`}
                  className="sr-only"
                >
                  Reps
                </Label>
                <span className="text-sm text-gray-500">reps</span>
              </div>
              {/* weight */}
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}-weight`}
                  className="w-16"
                >
                  Weight
                </Label>
                <Input
                  id={`set-${workoutPlanItem.id}-${set.id}-weight`}
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    updateWeight(set.id, parseInt(e.target.value, 10))
                  }
                  min={1}
                  className="w-20"
                />
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}-weight`}
                  className="sr-only"
                >
                  weight
                </Label>
                <span className="text-sm text-gray-500">kg</span>
              </div>
              {/* rest */}
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}-rest`}
                  className="w-16"
                >
                  Rest time
                </Label>
                <Input
                  id={`set-${workoutPlanItem.id}-${set.id}-rest`}
                  type="number"
                  value={set.rest}
                  onChange={(e) =>
                    updateRest(set.id, parseInt(e.target.value, 10))
                  }
                  min={1}
                  className="w-20"
                />
                <Label
                  htmlFor={`set-${workoutPlanItem.id}-${set.id}`}
                  className="sr-only"
                >
                  rest time
                </Label>
                <span className="text-sm text-gray-500">s</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSet(set.id)}
                aria-label="Remove set"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addSet} variant="outline" size="sm" className="mt-2">
          Add Set
        </Button>
      </CardContent>
    </Card>
  );
}

type WorkoutPlannerProps = {
  workoutPlanId: number;
};
export default function WorkoutPlanner({ workoutPlanId }: WorkoutPlannerProps) {
  const {
    workoutPlan,
    isWorkoutPlanLoading,
    addWorkoutItemToDb,
    refetchWorkoutPlan,
    updateWorkoutPlanInDb,
    removeWorkoutItemInDb,
  } = useWorkoutPlan({ workoutPlanId });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addWorkoutPlanItem = async () => {
    await addWorkoutItemToDb();
    refetchWorkoutPlan();
  };

  const removeWorkoutPlanItem = async (workoutPlanItem: WorkoutPlanItem) => {
    await removeWorkoutItemInDb({ workoutPlanItemId: workoutPlanItem.id });
    refetchWorkoutPlan();
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
    }
  };

  const finishPlanning = () => {};

  if (isWorkoutPlanLoading) {
    return <div>Loading...</div>;
  }

  if (!workoutPlan) {
    return <div>Workout Plan not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Planner</h1>
      <Button onClick={addWorkoutPlanItem} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add New Exercise
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(workoutPlan?.items ?? []).map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {(workoutPlan?.items ?? []).map((workoutPlanItem) => (
            <SortableWorkoutPlanItemCard
              key={workoutPlan.id}
              workoutPlanItem={workoutPlanItem}
              refreshWorkoutPlan={refetchWorkoutPlan}
              removeWorkoutPlanItem={removeWorkoutPlanItem}
            />
          ))}
        </SortableContext>
      </DndContext>
      <WorkoutFrequencyToggle
        selectedDays={selectedDays}
        onSelectedDaysChange={setSelectedDays}
        startDate={startDate}
        onStartDateChange={setStartDate}
      />
      <Button onClick={finishPlanning} className="mt-6">
        Finish Planning
      </Button>
    </div>
  );
}
