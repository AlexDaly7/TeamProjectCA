import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp, type AnyPgColumn, real } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),

    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    parentId: integer('parent_id').references((): AnyPgColumn => tasks.id, { onDelete: 'cascade' }),

    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    progress: real('progress').default(0), // 0.00 to 1.00 as %

    order: integer('order').default(0), // Order as sibling

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const taskRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    parent: one(tasks, {
        fields: [tasks.parentId],
        references: [tasks.id],
        relationName: 'subtasks',
    }),
    subtasks: many(tasks, {
        relationName: 'subtasks',
    }),
}));

const preprocessDate = z.preprocess((value) => {   
    // Since we submit the values as a date string, but we need
    // to format them into a Date instance back on the server, just
    // throw it into a new Date
    if (typeof value === 'string' && value.trim() !== '') return new Date(value);       
                                                                                                              
    return value;                                                                                                                                                                             
}, z.date());

export const InsertTask = createInsertSchema(tasks, {
    startTime: () => preprocessDate,
    endTime: () => preprocessDate,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type TasksSchema = typeof tasks.$inferSelect;

export type InsertTaskSchema = z.infer<typeof InsertTask>;