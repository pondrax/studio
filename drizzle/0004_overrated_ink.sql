ALTER TABLE "comments" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "post_id" TO "postId";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "category_id" TO "categoryId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "role_id" TO "roleId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "company_id" TO "companyId";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "pages" DROP CONSTRAINT "pages_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_category_id_questionsCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_questionsCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."questionsCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;