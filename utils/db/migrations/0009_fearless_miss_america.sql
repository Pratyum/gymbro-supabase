ALTER TABLE "workout_plan_item" ADD COLUMN "order" integer DEFAULT -1 NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_plan_item" ADD COLUMN "is_super_set" text DEFAULT 'false' NOT NULL;