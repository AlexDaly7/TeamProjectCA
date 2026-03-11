CREATE TYPE "public"."sync_status" AS ENUM('synced', 'pending', 'conflict');--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "github_issue_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "github_issue_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "sync_status" "sync_status" NOT NULL;