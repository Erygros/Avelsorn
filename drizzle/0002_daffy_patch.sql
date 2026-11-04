ALTER TABLE "time_entries" ADD COLUMN "charged_seconds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "time_entries" ADD COLUMN "segments" jsonb DEFAULT '[]'::jsonb NOT NULL;