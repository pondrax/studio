ALTER TABLE "questions" RENAME COLUMN "categoryId" TO "categoryid";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_categoryId_questionsCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryid_questionsCategory_id_fk" FOREIGN KEY ("categoryid") REFERENCES "public"."questionsCategory"("id") ON DELETE no action ON UPDATE no action;