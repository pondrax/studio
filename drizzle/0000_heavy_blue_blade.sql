CREATE TYPE "public"."notificationStatus" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notificationType" AS ENUM('email', 'table');--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"verified" boolean,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "applicants_email_unique" UNIQUE("email"),
	CONSTRAINT "applicants_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"file" text,
	"user_id" text,
	"post_id" text,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"abbrv" text,
	"active" boolean DEFAULT true,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"media" text NOT NULL,
	"user_id" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"media" text NOT NULL,
	"user_id" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"option" json,
	"answer" json,
	"category" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionsCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" boolean DEFAULT true,
	"protected" boolean DEFAULT false,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "questionsCategory_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"permissions" json DEFAULT '[]'::json,
	"active" boolean DEFAULT true,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"verified" boolean,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "vacancies" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"media" text,
	"category" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_superuser" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar" integer,
	"email" text,
	"tokenKey" text,
	"password" text NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_collections" (
	"id" text PRIMARY KEY NOT NULL,
	"system" boolean,
	"type" text,
	"name" text,
	"schema" json,
	"indexes" json,
	"listRule" text,
	"viewRule" text,
	"createRule" text,
	"updateRule" text,
	"deleteRule" text,
	"option" json,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_externalAuths" (
	"id" text PRIMARY KEY NOT NULL,
	"collectionId" text,
	"recordId" text,
	"provider" text,
	"providerId" text,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"level" integer,
	"message" text,
	"data" json,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"to" text,
	"subject" json,
	"content" text,
	"type" "notificationType" DEFAULT 'table',
	"status" "notificationStatus" DEFAULT 'pending',
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_params" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"value" json,
	"created" timestamp with time zone DEFAULT now(),
	"updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"table" text NOT NULL,
	"expired" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_questionsCategory_id_fk" FOREIGN KEY ("category") REFERENCES "public"."questionsCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_companies_id_fk" FOREIGN KEY ("company") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_externalAuths" ADD CONSTRAINT "_externalAuths_collectionId__collections_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."_collections"("id") ON DELETE no action ON UPDATE no action;