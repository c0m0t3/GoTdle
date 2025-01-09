ALTER TABLE "score" ADD COLUMN "recentScores" integer[][] DEFAULT ARRAY
  [[0, 0, 0]]::INTEGER[][];--> statement-breakpoint
ALTER TABLE "score" ADD COLUMN "dailyScore" integer[] DEFAULT ARRAY
  [0, 0, 0]::INTEGER[];