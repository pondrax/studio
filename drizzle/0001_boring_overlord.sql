ALTER TABLE "questions" RENAME COLUMN "category" TO "category_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "role" TO "role_id";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_category_questionsCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_questionsCategory_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."questionsCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;