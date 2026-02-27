ALTER TABLE "projects" RENAME COLUMN "repo" TO "repo_name";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "repo_owner" text NOT NULL;