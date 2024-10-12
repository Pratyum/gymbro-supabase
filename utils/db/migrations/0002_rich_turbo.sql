CREATE TABLE IF NOT EXISTS "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"category" text NOT NULL,
	"description" text,
	"force" text,
	"level" text,
	"equipment" text,
	"mechanic" text,
	"primary_muscles" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"secondary_muscles" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"image_urls" text[] DEFAULT ARRAY[]::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"friendly_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_plan_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_plan_id" integer,
	"exercise_id" integer,
	"name" text,
	"preview_image_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_plan_item_set" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_plan_item_id" integer,
	"weight" text NOT NULL,
	"reps" text NOT NULL,
	"rest" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"workout_plan_id" integer,
	"date" timestamp DEFAULT now(),
	"completed" text DEFAULT 'false' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_session_item_set_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_session_id" integer,
	"workout_plan_item_set_id" integer,
	"is_completed" text DEFAULT 'false' NOT NULL,
	"actual_reps" text NOT NULL,
	"actual_weight" text,
	"actual_rest" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan" ADD CONSTRAINT "workout_plan_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan_item" ADD CONSTRAINT "workout_plan_item_workout_plan_id_workout_plan_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan_item" ADD CONSTRAINT "workout_plan_item_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan_item_set" ADD CONSTRAINT "workout_plan_item_set_workout_plan_item_id_workout_plan_item_id_fk" FOREIGN KEY ("workout_plan_item_id") REFERENCES "public"."workout_plan_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_workout_plan_id_workout_plan_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session_item_set_log" ADD CONSTRAINT "workout_session_item_set_log_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session_item_set_log" ADD CONSTRAINT "workout_session_item_set_log_workout_plan_item_set_id_workout_plan_item_set_id_fk" FOREIGN KEY ("workout_plan_item_set_id") REFERENCES "public"."workout_plan_item_set"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
