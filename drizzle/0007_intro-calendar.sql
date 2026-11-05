CREATE TABLE "calendar_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"kind" text DEFAULT 'blocked' NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_block_duration" CHECK ("calendar_blocks"."ends_at" > "calendar_blocks"."starts_at"),
	CONSTRAINT "calendar_block_kind" CHECK ("calendar_blocks"."kind" IN ('blocked','open'))
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "topic" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "mail_outbox" ADD COLUMN "calendar_event" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "intro_credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "calendar_blocks_range" ON "calendar_blocks" USING btree ("starts_at","ends_at");
--> statement-breakpoint
ALTER TABLE "calendar_blocks" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    REVOKE ALL ON TABLE public.calendar_blocks FROM PUBLIC, anon, authenticated, service_role;
END IF;
END $$;
--> statement-breakpoint
UPDATE availability SET start=CASE WHEN weekday BETWEEN 1 AND 5 THEN '08:30' ELSE '12:00' END
WHERE weekday BETWEEN 1 AND 7 AND blocked=false AND start='08:00' AND "end"='17:00';
