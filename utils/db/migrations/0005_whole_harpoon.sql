ALTER TABLE "weight_log" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_log" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_log" ADD COLUMN "photo_url" text;