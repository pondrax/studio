CREATE TYPE "public"."notificationStatus" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
ALTER TABLE "_notifications" ADD COLUMN "status" "notificationStatus" DEFAULT 'pending';