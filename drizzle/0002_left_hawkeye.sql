ALTER TABLE "users" RENAME COLUMN "company" TO "company_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_company_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;