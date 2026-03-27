import { relations } from "drizzle-orm";
import {
    pgTable,
    integer,
    timestamp,
    primaryKey,
    text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { tasks } from "./tasks";
import { user } from "./auth";

export const taskAssignees = pgTable("task_assignees", {
    taskId: integer('task_id')
        .notNull()
        .references(() => tasks.id),
    
    userId: text('user_id')
        .notNull()
        .references(() => user.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => [
    primaryKey({ columns: [table.taskId, table.userId] }),
]);

export const taskAssigneeRelations = relations(taskAssignees, ({ one }) => ({
    task: one(tasks, {
        fields: [taskAssignees.taskId],
        references: [tasks.id],
    }),
    user: one(user, {
        fields: [taskAssignees.userId],
        references: [user.id],
    }),
}));


// Create
export const InsertTaskAssignee = createInsertSchema(taskAssignees).omit({
    createdAt: true,
    updatedAt: true,
});

export type InsertTaskAssigneeSchema = z.infer<typeof InsertTaskAssignee>;