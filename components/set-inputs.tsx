import { WorkoutPlanItemSet } from "@/types";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type SetInputsProps = {
  set: WorkoutPlanItemSet;
  setIndex: number;
  workoutPlanItemId: number;
  debouncedUpdateSet: (
    setId: number,
    field: keyof WorkoutPlanItemSet,
    value: string
  ) => void;
  removeSet: (workoutItemSetId: number) => void;
};
export function SetInputs({
  set,
  setIndex,
  workoutPlanItemId,
  debouncedUpdateSet,
  removeSet,
}: SetInputsProps) {
  const [reps, setReps] = useState(set.reps);
  const [weight, setWeight] = useState(set.weight);
  const [rest, setRest] = useState(set.rest);

  const handleInputChange = (
    field: keyof WorkoutPlanItemSet,
    value: string
  ) => {
    switch (field) {
      case "reps":
        setReps(value);
        break;
      case "weight":
        setWeight(value);
        break;
      case "rest":
        setRest(value);
        break;
    }
    debouncedUpdateSet(set.id, field, value.toString());
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 max-sm:border max-sm:p-3 max-sm:border-slate-400 rounded">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <Label
          htmlFor={`set-${workoutPlanItemId}-${set.id}-reps`}
          className="w-16 text-sm font-medium flex-1"
        >
          Set {setIndex + 1}
        </Label>
        <div className="flex items-center space-x-1">
          <Input
            id={`set-${workoutPlanItemId}-${set.id}-reps`}
            type="number"
            value={reps}
            onChange={(e) => handleInputChange("reps", e.target.value)}
            min={1}
            className="w-16 text-sm"
          />
          <span className="text-sm text-gray-500">reps</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <Label
          htmlFor={`set-${workoutPlanItemId}-${set.id}-weight`}
          className="w-16 text-sm font-medium flex-1"
        >
          Weight
        </Label>
        <div className="flex items-center space-x-1">
          <Input
            id={`set-${workoutPlanItemId}-${set.id}-weight`}
            type="number"
            value={weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            min={1}
            className="w-16 text-sm"
          />
          <span className="text-sm text-gray-500">kg</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <Label
          htmlFor={`set-${workoutPlanItemId}-${set.id}-rest`}
          className="w-16 text-sm font-medium flex-1"
        >
          Rest
        </Label>
        <div className="flex items-center space-x-1">
          <Input
            id={`set-${workoutPlanItemId}-${set.id}-rest`}
            type="number"
            value={rest}
            onChange={(e) => handleInputChange("rest", e.target.value)}
            min={1}
            className="w-16 text-sm"
          />
          <span className="text-sm text-gray-500">s</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeSet(set.id)}
        aria-label="Remove set"
        className="max-sm:w-full p-1"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
