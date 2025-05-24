import { Session, User } from "@supabase/supabase-js";
import { SelectUser } from "./utils/db/schema";

export enum DayOfWeek {
  sunday = "sunday",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
}

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
  frequency: DayOfWeek[];
  startDate?: Date;
};

export type WorkoutPlanItem = {
  id: number;
  workoutPlanId: number;
  exerciseId: number;
  order: number;
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
export type WorkoutSessionItemLog = {
  id: number;
  workoutSessionId: number | null;
  workoutPlanItemSetId: number | null;
  isCompleted: string;
  actualReps?: string;
  actualWeight?: string | null;
  actualRest?: string | null;
};

export type WorkoutSession = {
  id: number;
  userId: number;
  workoutPlanId: number;
  createdAt: Date;
  plannedAt?: Date;
  startedAt?: Date;
  completed: "true" | "false";
  sets?: WorkoutSessionItemLog[];
};

export type WorkoutSessionWithPlan = WorkoutSession & {
  workoutPlan?: WorkoutPlanWithItemsAndSets;
};

// Organizations
export type Organization = {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  adminUserId: number;
};

export type Leads = {
  id: number;
  source: string;
  status: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Appointment = {
  id: number;
  userId: number;
  trainerId: number;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
};

export type AuthUser = {
  supabaseUser: User | null;
  dbUser: SelectUser | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};