ALTER TABLE "user" ADD COLUMN "createdAt" timestamp DEFAULT NOW
  () + INTERVAL '1 hour';