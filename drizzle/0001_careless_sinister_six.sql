CREATE TABLE "video_signals" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "video_signals" ADD CONSTRAINT "video_signals_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_signals" ADD CONSTRAINT "video_signals_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "room_signals" ON "video_signals" USING btree ("booking_id","created_at");