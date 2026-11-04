ALTER TABLE "packages" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "time_entries" ADD COLUMN "revision" integer DEFAULT 0 NOT NULL;