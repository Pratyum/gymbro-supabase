DO $$ BEGIN
 CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "workout_plan" ADD COLUMN "frequency" day_of_week[] DEFAULT ARRAY[]::day_of_week[] NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_plan" ADD COLUMN "start_date" timestamp;