CREATE TABLE "video_rooms" (
	"booking_id" text PRIMARY KEY NOT NULL,
	"generation" integer DEFAULT 1 NOT NULL,
	"customer_joined_at" timestamp with time zone,
	"admin_joined_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "video_rooms" ADD CONSTRAINT "video_rooms_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;