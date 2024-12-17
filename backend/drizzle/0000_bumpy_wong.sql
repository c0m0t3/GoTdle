CREATE TABLE IF NOT EXISTS "score" (
	"userId" uuid NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"lastPlayed" timestamp DEFAULT '2024-12-15 21:27:54.224',
	"longestStreak" integer DEFAULT 0,
	"dailyScore" integer DEFAULT 0,
	CONSTRAINT "score_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score" ADD CONSTRAINT "score_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
