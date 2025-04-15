ALTER TABLE "questions" RENAME COLUMN "categoryid" TO "category_id";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_categoryid_questionsCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_questionsCategory_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."questionsCategory"("id") ON DELETE no action ON UPDATE no action;