export type Exercise = {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
};

export type WorkoutPlan = {
  id: number;
  userId: number;
  friendlyName: string;
};

export type WorkoutPlanItem = {
  id: number;
  workoutPlanId: number;
  exerciseId: number;
};

export type WorkoutPlanItemSet = {
  id: number;
  workoutPlanItemId: number;
  reps: string;
  weight: string;
  rest: string;
};

export type WorkoutPlanItemWithSets = WorkoutPlanItem & {
  sets: WorkoutPlanItemSet[];
};

export type WorkoutPlanWithItemsAndSets = WorkoutPlan & {
  items: WorkoutPlanItemWithSets[];
};
