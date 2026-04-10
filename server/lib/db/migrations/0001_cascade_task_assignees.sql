ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;