CREATE TABLE IF NOT EXISTS "character" (
	"_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"gender" varchar(256),
	"born" varchar(256),
	"origin" varchar(256),
	"death" varchar(256),
	"status" varchar(256),
	"culture" varchar(256),
	"religion" varchar(256),
	"titles" varchar(256)[],
	"house" varchar(256),
	"father" varchar(256),
	"mother" varchar(256),
	"spouse" varchar(256)[],
	"children" varchar(256)[],
	"siblings" varchar(256)[],
	"lovers" varchar(256)[],
	"seasons" integer[],
	"actor" varchar(256),
	CONSTRAINT "character_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "score" ALTER COLUMN "lastPlayed" SET DEFAULT '2024-12-19 16:54:44.125';