CREATE TABLE "guest_bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"topic" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"sequence" integer DEFAULT 0 NOT NULL,
	"token_hash" text NOT NULL,
	"access_expires_at" timestamp with time zone NOT NULL,
	"request_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guest_bookings_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "guest_bookings_request_id_unique" UNIQUE("request_id"),
	CONSTRAINT "guest_booking_duration" CHECK ("guest_bookings"."ends_at" = "guest_bookings"."starts_at" + interval '15 minutes'),
	CONSTRAINT "guest_booking_status" CHECK ("guest_bookings"."status" IN ('confirmed','cancelled','completed'))
);
--> statement-breakpoint
CREATE INDEX "guest_bookings_range" ON "guest_bookings" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "guest_bookings_email" ON "guest_bookings" USING btree ("email");--> statement-breakpoint
ALTER TABLE "guest_bookings" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
REVOKE ALL ON TABLE "guest_bookings" FROM PUBLIC;
--> statement-breakpoint
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    REVOKE ALL ON TABLE guest_bookings FROM anon, authenticated, service_role;
END IF;
END $$;
