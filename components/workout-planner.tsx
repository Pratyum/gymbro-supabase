"use client";

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
import ExerciseSelect from "./exercise-select";

import { WorkoutFrequencyToggle } from "./workout-frequency-toggle";
import { useWorkoutPlanItem } from "@/hooks/use-workout-plan-item";
import { Exercise, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { useWorkoutPlan } from "@/hooks/use-workout-plan";
import useDebounce from "@/hooks/use-debounce";
import { SetInputs } from "./set-inputs";
import { useRouter } from "next/navigation";

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

  const updateSet = useDebounce(
    async (setId: number, field: keyof WorkoutPlanItemSet, value: string) => {
      await updateSetToDb({
        id: setId,
        [field]: value,
      });
      refreshWorkoutPlan();
    },
    500,
  );

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
            <SetInputs
              removeSet={removeSet}
              setIndex={setIndex}
              workoutPlanItemId={workoutPlanItem.id}
              debouncedUpdateSet={updateSet}
              set={set}
              key={set.id}
            />
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
    updateWorkoutPlanItemInDb,
    removeWorkoutItemInDb,
  } = useWorkoutPlan({ workoutPlanId });
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addWorkoutPlanItem = async () => {
    await addWorkoutItemToDb();
    refetchWorkoutPlan();
  };

  const removeWorkoutPlanItem = async (workoutPlanItem: WorkoutPlanItem) => {
    await removeWorkoutItemInDb({ workoutPlanItemId: workoutPlanItem.id });
    refetchWorkoutPlan();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }
    if (!workoutPlan?.items) return;
    const oldIndex = workoutPlan.items.findIndex(
      (item) => item.id === active.id,
    );
    const newIndex = workoutPlan.items.findIndex((item) => item.id === over.id);

    const newItems = Array.from(workoutPlan.items);
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    // Update the order property for each item
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    const promises = updatedItems.map((item, index) => {
      if (item.id === workoutPlan.items[index].id) return Promise.resolve();
      return updateWorkoutPlanItemInDb({
        workoutPlan: item,
        workoutPlanItemId: item.id,
      });
    });
    const responses = await Promise.allSettled(promises);
    refetchWorkoutPlan();
  };

  const finishPlanning = async () => {
    router.push(`/workouts`);
  };

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
          items={(workoutPlan?.items ?? []).map((e) => ({ id: e.id }))}
          strategy={verticalListSortingStrategy}
        >
          {(workoutPlan?.items ?? []).map((workoutPlanItem) => (
            <SortableWorkoutPlanItemCard
              key={workoutPlanItem.id}
              workoutPlanItem={workoutPlanItem}
              refreshWorkoutPlan={refetchWorkoutPlan}
              removeWorkoutPlanItem={removeWorkoutPlanItem}
            />
          ))}
        </SortableContext>
      </DndContext>
      <WorkoutFrequencyToggle
        selectedDays={workoutPlan.frequency}
        onSelectedDaysChange={async (days) => {
          await updateWorkoutPlanInDb({ frequency: days });
          refetchWorkoutPlan();
        }}
        startDate={workoutPlan.startDate}
        onStartDateChange={async (date) => {
          await updateWorkoutPlanInDb({ startDate: date });
          refetchWorkoutPlan();
        }}
      />
      <Button onClick={finishPlanning} className="mt-6">
        Finish Planning
      </Button>
    </div>
  );
}
