CREATE TABLE IF NOT EXISTS "weight_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"weight" text NOT NULL,
	"date" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weight_log" ADD CONSTRAINT "weight_log_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
