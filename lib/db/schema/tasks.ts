import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp, type AnyPgColumn, real } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    // desc: text("desc").notNull(),

    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => tasks.id, { onDelete: 'cascade' }),

    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_date').notNull(),
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