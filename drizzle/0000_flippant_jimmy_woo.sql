CREATE TABLE "cars" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"price" integer NOT NULL,
	"price_label" text NOT NULL,
	"mileage" text NOT NULL,
	"transmission" text NOT NULL,
	"fuel" text NOT NULL,
	"condition" text NOT NULL,
	"location" text NOT NULL,
	"colour" text NOT NULL,
	"description" text NOT NULL,
	"alt" text NOT NULL,
	"image_note" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"images" jsonb NOT NULL,
	"features" jsonb NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cars_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"car_slug" text,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "cars_status_idx" ON "cars" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cars_featured_idx" ON "cars" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "cars_added_at_idx" ON "cars" USING btree ("added_at");--> statement-breakpoint
CREATE INDEX "leads_type_idx" ON "leads" USING btree ("type");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");