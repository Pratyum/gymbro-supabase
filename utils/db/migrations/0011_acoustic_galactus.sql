CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"website" text,
	"logo_url" text,
	"cover_url" text,
	"description" text,
	"admin_user_id" integer
);
--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "organization_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_admin_user_id_users_table_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
