ALTER TABLE "user" ADD COLUMN "selected_group" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "selected_project" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_selected_group_groups_id_fk" FOREIGN KEY ("selected_group") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_selected_project_projects_id_fk" FOREIGN KEY ("selected_project") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;