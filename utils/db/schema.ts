import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    phoneNumber: text('phone_number').notNull().unique(),
    email: text('email'),
    plan: text('plan').notNull(),
    stripe_id: text('stripe_id').notNull(),
});

export const exercisesTable = pgTable('exercises', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    category: text('category').notNull(),
    description: text('description'),
    force: text('force'),
    level: text('level'),
    equipment: text('equipment'),
    mechanic: text('mechanic'),
    primaryMuscles: text('primary_muscles').array().notNull().default(sql`ARRAY[]::text[]`),
    secondaryMuscles: text('secondary_muscles').array().notNull().default(sql`ARRAY[]::text[]`),
    imageUrls: text('image_urls').array().notNull().default(sql`ARRAY[]::text[]`),
});

export const workoutPlan = pgTable('workout_plan', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id),
    friendlyName: text('friendly_name').notNull()
});

export const workoutPlanRelations = relations(workoutPlan, ({many}) => ({
    items: many(workoutPlanItem),
}))

export const workoutPlanItem = pgTable('workout_plan_item', {
    id: serial('id').primaryKey(),
    workoutPlanId: integer('workout_plan_id').references(() => workoutPlan.id),
    exerciseId: integer('exercise_id').references(() => exercisesTable.id),
    name: text('name'),
    previewImageUrl: text('preview_image_url'),
});

export const workoutPlanItemRelations = relations(workoutPlanItem, ({many}) => ({
    sets: many(workoutPlanItemSet),
}));

export const workoutPlanItemSet = pgTable('workout_plan_item_set', {
    id: serial('id').primaryKey(),
    workoutPlanItemId: integer('workout_plan_item_id').references(() => workoutPlanItem.id),
    weight: text('weight').notNull(),
    reps: text('reps').notNull(),
    rest: text('rest').notNull(),
});

export const workoutSession = pgTable('workout_session', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id),
    workoutPlanId: integer('workout_plan_id').references(() => workoutPlan.id),
    createdAt: timestamp('date').defaultNow(),
    completed: text('completed').notNull().default('false'),
});

export const workoutSessionRelations = relations(workoutSession, ({many}) => ({
    sets: many(workoutSessionItemSetLog),
}));

export const workoutSessionItemSetLog = pgTable('workout_session_item_set_log', {
    id: serial('id').primaryKey(),
    workoutSessionId: integer('workout_session_id').references(() => workoutSession.id),
    workoutPlanItemSetId: integer('workout_plan_item_set_id').references(() => workoutPlanItemSet.id),
    isCompleted: text('is_completed').notNull().default('false'),
    actualReps: text('actual_reps').notNull(),
    actualWeight: text('actual_weight'),
    actualRest: text('actual_rest'),
});

export const weightLog = pgTable('weight_log', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => usersTable.id),
    weight: text('weight').notNull(),
    date: timestamp('date').notNull().defaultNow(),
    photoUrl: text('photo_url'),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertExercise = typeof exercisesTable.$inferInsert;
export type SelectExercise = typeof exercisesTable.$inferSelect;

export type InsertWorkoutPlan = typeof workoutPlan.$inferInsert;
export type SelectWorkoutPlan = typeof workoutPlan.$inferSelect;

export type InsertWorkoutPlanItem = typeof workoutPlanItem.$inferInsert;
export type SelectWorkoutPlanItem = typeof workoutPlanItem.$inferSelect;

export type InsertWorkoutPlanItemSet = typeof workoutPlanItemSet.$inferInsert;
export type SelectWorkoutPlanItemSet = typeof workoutPlanItemSet.$inferSelect;

export type InsertWorkoutSession = typeof workoutSession.$inferInsert;
export type SelectWorkoutSession = typeof workoutSession.$inferSelect;

export type InsertWorkoutSessionItemSetLog = typeof workoutSessionItemSetLog.$inferInsert;
export type SelectWorkoutSessionItemSetLog = typeof workoutSessionItemSetLog.$inferSelect;

export type InsertWeightLog = typeof weightLog.$inferInsert;
export type SelectWeightLog = typeof weightLog.$inferSelect;