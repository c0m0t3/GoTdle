ALTER TABLE "score" ADD COLUMN "dailyScore" integer[] DEFAULT ARRAY
  [0]::INTEGER[];