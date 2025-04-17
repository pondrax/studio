CREATE TYPE "public"."status" AS ENUM('draft', 'published', 'closed');--> statement-breakpoint
CREATE TABLE "questionsTemplate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"grouping" json DEFAULT '[]'::json,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "references" (
	"id" text PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0,
	"name" text NOT NULL,
	"value" text DEFAULT '',
	"category_id" text NOT NULL,
	"active" boolean DEFAULT false,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referencesCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"type" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "referencesCategory_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "criteria" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "quota" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "start" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "end" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "status" "status" DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "references" ADD CONSTRAINT "references_category_id_referencesCategory_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."referencesCategory"("id") ON DELETE no action ON UPDATE no action;