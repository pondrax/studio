ALTER TABLE "comments" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "postId" TO "post_id";--> statement-breakpoint
ALTER TABLE "pages" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "roleId" TO "role_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "companyId" TO "company_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "pages" DROP CONSTRAINT "pages_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;