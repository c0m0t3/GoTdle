ALTER TABLE "score" ALTER COLUMN "dailyScore" SET DATA TYPE integer[][];--> statement-breakpoint
ALTER TABLE "score" ALTER COLUMN "dailyScore" SET DEFAULT ARRAY
  [[0, 0, 0]]::INTEGER[][];