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

export interface DailyGoals {
  id?: number;
  userId: number;
  stepsGoal: number;
  waterGoal: number;
  sleepGoal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrainingProgram {
  id?: number;
  name: string;
  description?: string;
  trainerId: number;
  clientId: number;
  durationWeeks: number;
  startDate: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  weeklySchedules?: WeeklySchedule[];
  client?: {
    id: number;
    name: string;
    email?: string;
    phoneNumber: string;
  };
}

export interface WeeklySchedule {
  id?: number;
  programId: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  type: 'workout' | 'rest';
  workoutPlanId?: number;
  notes?: string;
  workoutPlan?: {
    id: number;
    friendlyName: string;
  };
}

export interface ProgramMetadata {
  id?: number;
  workoutPlanId: number;
  assignedBy: number;
  assignedTo: number;
  programName: string;
  description?: string;
  durationWeeks: number;
  startDate: Date;
  isActive?: boolean;
  createdAt?: Date;
}

export interface ProgramInstance {
  id?: number;
  programId: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
}

export interface DailyGoalLog {
  id?: number;
  userId: number;
  date: Date;
  stepsCompleted: number;
  waterCompleted: number;
  sleepHours: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Onboarding wizard state
export interface OnboardingState {
  step: number;
  client?: {
    id: number;
    name: string;
    email?: string;
    phoneNumber: string;
  };
  goals: {
    stepsGoal: number;
    waterGoal: number;
    sleepGoal: number;
  };
  program: {
    name: string;
    description?: string;
    durationWeeks: number;
    startDate: Date;
    workoutPlanId?: number; // Use existing workout plan
    createNewPlan: boolean; // Toggle between existing vs new plan
    scheduleDays: number[]; // Which days to schedule (0=Sunday, 1=Monday, etc)
  };
}

export interface OnboardingWizardProps {
  onComplete: (data: OnboardingState) => void;
  onCancel: () => void;
}

export interface StepProps {
  data: OnboardingState;
  onUpdate: (updates: Partial<OnboardingState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
] as const;