"use server";
import { WorkoutPlan, WorkoutPlanItem, WorkoutPlanItemSet } from "@/types";
import { db } from "@/utils/db/db";
import {
  InsertWorkoutPlan,
  InsertWorkoutPlanItem,
  InsertWorkoutPlanItemSet,
  workoutPlan,
  workoutPlanItem,
  workoutPlanItemSet,
} from "@/utils/db/schema";
import { eq, inArray } from "drizzle-orm";

// Get Workout Plan with items and sets

export const getWorkoutPlanById = async (id: number) => {
  try {
    const res = await db
      .select()
      .from(workoutPlan)
      .where(eq(workoutPlan.id, id));
    if (!res || !res.length) {
      return { success: false, data: undefined };
    }
    const workoutData = res[0] as WorkoutPlan;

    const resWorkoutItems = await db
      .select()
      .from(workoutPlanItem)
      .where(eq(workoutPlanItem.workoutPlanId, id)).orderBy(workoutPlanItem.order) as WorkoutPlanItem[];
    if (!resWorkoutItems) {
      return {
        success: true,
        data: {
          ...workoutData,
          items: [],
        },
      };
    }

    const workoutItemIds = resWorkoutItems.map((item) => item.id);

    const resWorkoutItemSets = await db
      .select()
      .from(workoutPlanItemSet)
      .where(inArray(workoutPlanItemSet.workoutPlanItemId, workoutItemIds)).orderBy(workoutPlanItemSet.id) as WorkoutPlanItemSet[];
    if (!resWorkoutItemSets || !resWorkoutItemSets.length) {
      return {
        success: true,
        data: {
          ...workoutData,
          items: resWorkoutItems.map((item) => ({ ...item, sets: [] })),
        },
      };
    }

    const workoutItems = resWorkoutItems.map((item) => {
      return {
        ...item,
        sets: resWorkoutItemSets.filter(
          (set) => set.workoutPlanItemId === item.id
        ),
      };
    });

    return {
      success: true,
      data: {
        ...workoutData,
        items: workoutItems,
      },
    };
  } catch (e) {
    console.log(e);
    return { success: false, data: undefined };
  }
};

export const getWorkoutPlansForUser = async (userId: number) => {
  const workoutPlans = await db
    .select()
    .from(workoutPlan)
    .where(eq(workoutPlan.userId, userId));
  return { success: true, data: workoutPlans };
};

// Workout Plan

export const createNewWorkoutPlan = async (payload: InsertWorkoutPlan) => {
  const data = await db
    .insert(workoutPlan)
    .values(payload)
    .returning({ id: workoutPlan.id });
  return { success: true, data };
};

export const updateWorkoutPlan = async (
  id: number,
  payload: Partial<InsertWorkoutPlan>
) => {
  await db.update(workoutPlan).set(payload).where(eq(workoutPlan.id, id));
  return { success: true };
};

export const removeWorkoutPlan = async (id: number) => {
  await db.delete(workoutPlan).where(eq(workoutPlan.id, id));
  return { success: true };
};

// Workout Plan Item

export const addWorkoutPlanItem = async (payload: InsertWorkoutPlanItem) => {
  const data = await db
    .insert(workoutPlanItem)
    .values(payload)
    .returning({ id: workoutPlanItem.id });
  return { success: true, data };
};

export const updateWorkoutPlanItem = async (
  id: number,
  payload: Partial<InsertWorkoutPlanItem>
) => {
  await db
    .update(workoutPlanItem)
    .set(payload)
    .where(eq(workoutPlanItem.id, id));
  return { success: true };
};

export const removeWorkoutPlanItem = async (id: number) => {
  await db.delete(workoutPlanItem).where(eq(workoutPlanItem.id, id));
  return { success: true };
};

// Workout Plan Item Set

export const addWorkoutPlanItemSet = async (
  payload: InsertWorkoutPlanItemSet
) => {
  const data = await db
    .insert(workoutPlanItemSet)
    .values(payload)
    .returning({ id: workoutPlanItemSet.id });
  return { success: true, data };
};

export const updateWorkoutPlanItemSet = async (
  id: number,
  payload: Partial<InsertWorkoutPlanItemSet>
) => {
  await db
    .update(workoutPlanItemSet)
    .set(payload)
    .where(eq(workoutPlanItemSet.id, id));
  return { success: true };
};

export const removeWorkoutPlanItemSet = async (id: number) => {
  await db.delete(workoutPlanItemSet).where(eq(workoutPlanItemSet.id, id));
  return { success: true };
};
