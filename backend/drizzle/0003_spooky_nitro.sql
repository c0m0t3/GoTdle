ALTER TABLE "score" ALTER COLUMN "lastPlayed" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "score" ALTER COLUMN "longestStreak" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "score" ALTER COLUMN "dailyScore" SET DATA TYPE integer[];--> statement-breakpoint
ALTER TABLE "score" ALTER COLUMN "dailyScore" DROP DEFAULT;