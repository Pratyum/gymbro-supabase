ALTER TABLE "weight_log" DROP CONSTRAINT "weight_log_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_plan_item" DROP CONSTRAINT "workout_plan_item_workout_plan_id_workout_plan_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_plan_item_set" DROP CONSTRAINT "workout_plan_item_set_workout_plan_item_id_workout_plan_item_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_session_item_set_log" DROP CONSTRAINT "workout_session_item_set_log_workout_session_id_workout_session_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_session_item_set_log" DROP CONSTRAINT "workout_session_item_set_log_workout_plan_item_set_id_workout_plan_item_set_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weight_log" ADD CONSTRAINT "weight_log_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan_item" ADD CONSTRAINT "workout_plan_item_workout_plan_id_workout_plan_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plan"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_plan_item_set" ADD CONSTRAINT "workout_plan_item_set_workout_plan_item_id_workout_plan_item_id_fk" FOREIGN KEY ("workout_plan_item_id") REFERENCES "public"."workout_plan_item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session_item_set_log" ADD CONSTRAINT "workout_session_item_set_log_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_session_item_set_log" ADD CONSTRAINT "workout_session_item_set_log_workout_plan_item_set_id_workout_plan_item_set_id_fk" FOREIGN KEY ("workout_plan_item_set_id") REFERENCES "public"."workout_plan_item_set"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
