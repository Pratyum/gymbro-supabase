CREATE TABLE IF NOT EXISTS "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"organization_id" integer,
	"role" text DEFAULT 'member' NOT NULL,
	"active" text DEFAULT 'true' NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"custom_data" json DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainer_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer,
	"client_id" integer,
	"assigned_at" timestamp DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainer_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer,
	"client_id" integer,
	"title" text NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"location" text,
	"notes" text,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainer_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"trainer_id" integer,
	"title" text NOT NULL,
	"description" text,
	"client_id" integer,
	"due_date" timestamp,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_clients" ADD CONSTRAINT "trainer_clients_trainer_id_users_table_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_clients" ADD CONSTRAINT "trainer_clients_client_id_users_table_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_sessions" ADD CONSTRAINT "trainer_sessions_trainer_id_users_table_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_sessions" ADD CONSTRAINT "trainer_sessions_client_id_users_table_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_tasks" ADD CONSTRAINT "trainer_tasks_trainer_id_users_table_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainer_tasks" ADD CONSTRAINT "trainer_tasks_client_id_users_table_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users_table"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
