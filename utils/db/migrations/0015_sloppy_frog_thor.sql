ALTER TABLE "users_table" DROP CONSTRAINT "users_table_phone_number_unique";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "phone_number" DROP NOT NULL;