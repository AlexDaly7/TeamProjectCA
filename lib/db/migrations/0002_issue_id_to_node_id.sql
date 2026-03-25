ALTER TABLE "tasks" ADD COLUMN "gh_issue_node_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "issue_id";