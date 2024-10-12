ALTER TABLE "users_table" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "phone_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_phone_number_unique" UNIQUE("phone_number");