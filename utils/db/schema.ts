import { relations, sql } from "drizzle-orm";
import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phoneNumber: text("phone_number").notNull().unique(),
    email: text("email"),
    plan: text("plan").notNull(),
    stripe_id: text("stripe_id").notNull(),
    organizationId: integer("organization_id"),
    role: text("role").notNull().default("member"),
});

export const exercisesTable = pgTable("exercises", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    category: text("category").notNull(),
    description: text("description"),
    force: text("force"),
    level: text("level"),
    equipment: text("equipment"),
    mechanic: text("mechanic"),
    primaryMuscles: text("primary_muscles")
        .array()
        .notNull()
        .default(sql`ARRAY[]::text[]`),
    secondaryMuscles: text("secondary_muscles")
        .array()
        .notNull()
        .default(sql`ARRAY[]::text[]`),
    imageUrls: text("image_urls")
        .array()
        .notNull()
        .default(sql`ARRAY[]::text[]`),
});
export const dayOfWeekEnum = pgEnum("day_of_week", [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]);
export const workoutPlan = pgTable("workout_plan", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => usersTable.id),
    friendlyName: text("friendly_name").notNull(),
    frequency: dayOfWeekEnum("frequency")
        .array()
        .notNull()
        .default(sql`ARRAY[]::day_of_week[]`),
    startDate: timestamp("start_date"),
});

export const workoutPlanRelations = relations(workoutPlan, ({ many }) => ({
    items: many(workoutPlanItem, { relationName: "workoutPlanId" }),
}));

export const workoutPlanItem = pgTable("workout_plan_item", {
    id: serial("id").primaryKey(),
    workoutPlanId: integer("workout_plan_id").references(() => workoutPlan.id, {
        onDelete: "cascade",
    }),
    exerciseId: integer("exercise_id").references(() => exercisesTable.id),
    name: text("name"),
    previewImageUrl: text("preview_image_url"),
    order: integer("order").notNull().default(-1), // This is the order in which to do the exercises
    isSuperSet: text("is_super_set").notNull().default("false"),
});

export const workoutPlanItemRelations = relations(
    workoutPlanItem,
    ({ many }) => ({
        sets: many(workoutPlanItemSet, { relationName: "workoutPlanItemId" }),
    }),
);

export const workoutPlanItemSet = pgTable("workout_plan_item_set", {
    id: serial("id").primaryKey(),
    workoutPlanItemId: integer("workout_plan_item_id").references(
        () => workoutPlanItem.id,
        { onDelete: "cascade" },
    ),
    weight: text("weight").notNull(),
    reps: text("reps").notNull(),
    rest: text("rest").notNull(),
});

export const workoutSession = pgTable("workout_session", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => usersTable.id),
    workoutPlanId: integer("workout_plan_id").references(() => workoutPlan.id),
    createdAt: timestamp("date").defaultNow(),
    plannedAt: timestamp("planned_at"),
    startedAt: timestamp("started_at"),
    completed: text("completed").notNull().default("false"),
});

export const workoutSessionRelations = relations(
    workoutSession,
    ({ many }) => ({
        sets: many(workoutSessionItemSetLog),
    }),
);

export const workoutSessionItemSetLog = pgTable(
    "workout_session_item_set_log",
    {
        id: serial("id").primaryKey(),
        workoutSessionId: integer("workout_session_id").references(
            () => workoutSession.id,
            { onDelete: "cascade" },
        ),
        workoutPlanItemSetId: integer("workout_plan_item_set_id").references(
            () => workoutPlanItemSet.id,
            { onDelete: "cascade" },
        ),
        isCompleted: text("is_completed").notNull().default("false"),
        actualReps: text("actual_reps").notNull(),
        actualWeight: text("actual_weight"),
        actualRest: text("actual_rest"),
    },
);

export const weightLog = pgTable("weight_log", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    weight: text("weight").notNull(),
    date: timestamp("date").notNull().defaultNow(),
    photoUrl: text("photo_url"),
});

// Organizations
export const organizations = pgTable("organizations", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    website: text("website"),
    logoUrl: text("logo_url"),
    coverUrl: text("cover_url"),
    description: text("description"),
    adminUserId: integer("admin_user_id").references(() => usersTable.id),
});

export const organizationUsersRelations = relations(usersTable, ({ one }) => ({
    organization: one(organizations, {
        relationName: "organizationId",
        fields: [usersTable.organizationId],
        references: [organizations.id],
    }),
}));

// Leads
export const leads = pgTable(
    "leads",
    {
        id: serial("id").primaryKey(),
        source: text("source").notNull(),
        status: text("status").notNull().default("new"),
        name: text("name"),
        email: text("email"),
        phone: text("phone"),
        notes: text("notes"),
        organizationId: integer("organization_id").references(
            () => organizations.id,
        ),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        unq: unique().on(t.id, t.name, t.organizationId, t.phone),
    }),
);

// Social integrations
export const socialIntegrations = pgTable("social_integrations", {
    id: serial("id").primaryKey(),
    organizationId: integer("organization_id").references(() => organizations.id),
    platform: text("platform").notNull(), // 'facebook' or 'instagram'
    accessToken: text("access_token").notNull(),
    pageId: text("page_id").notNull(),
    pageName: text("page_name").notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => usersTable.id)
        .notNull(),
    trainerId: integer("trainer_id").references(() => usersTable.id),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    notes: text("notes"),
});

export const appointmentRelations = relations(appointments, ({ one }) => ({
    user: one(usersTable),
    trainer: one(usersTable),
}));

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

export type InsertWorkoutSessionItemSetLog =
  typeof workoutSessionItemSetLog.$inferInsert;
export type SelectWorkoutSessionItemSetLog =
  typeof workoutSessionItemSetLog.$inferSelect;

export type InsertWeightLog = typeof weightLog.$inferInsert;
export type SelectWeightLog = typeof weightLog.$inferSelect;

export type InsertOrganization = typeof organizations.$inferInsert;
export type SelectOrganization = typeof organizations.$inferSelect;

export type InsertLead = typeof leads.$inferInsert;
export type SelectLead = typeof leads.$inferSelect;

export type InsertSocialIntegration = typeof socialIntegrations.$inferInsert;
export type SelectSocialIntegration = typeof socialIntegrations.$inferSelect;

export type InsertAppointment = typeof appointments.$inferInsert;
export type SelectAppointment = typeof appointments.$inferSelect;
