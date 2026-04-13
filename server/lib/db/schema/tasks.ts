import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp, type AnyPgColumn, real } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import z from 'zod';
import { taskAssignees } from './taskAssignees';
import { user } from './auth';
import { preprocessDate } from '~~/shared/utils/preprocessDate';

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),

    projectId: integer('project_id')
        .references(() => projects.id, { onDelete: 'cascade' })
        .notNull(),
    parentId: integer('parent_id').references((): AnyPgColumn => tasks.id, {
        onDelete: 'cascade',
    }),

    ghIssueNodeId: text('gh_issue_node_id').notNull(),
    ghIssueNumber: integer('gh_issue_number').notNull(),

    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    progress: real('progress').default(0), // 0.00 to 1.00 as %

    order: integer('order').default(0), // Order as sibling

    creatorId: text('creator_id')
        .references(() => user.id)
        .notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
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
    creator: one(user, {
        fields: [tasks.creatorId],
        references: [user.id],
    }),
    subtasks: many(tasks, {
        relationName: 'subtasks',
    }),
    assignees: many(taskAssignees),
}));

// Create
export const InsertTask = createInsertSchema(tasks, {
    title: z.string().min(3, 'Too short!').max(100, 'Too long!'),
    description: z.string().max(2000, 'Too long!').nullable(),
    startTime: () => preprocessDate,
    endTime: () => preprocessDate,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertTaskSchema = z.infer<typeof InsertTask>;

// READ
export type TasksSchema = typeof tasks.$inferSelect;

// UPDATE
export const ModifyTask = createUpdateSchema(tasks, {
    title: z.string().min(3, 'Too short!').max(100, 'Too long!').optional(),
    description: z.string().max(2000, 'Too long!').optional(),
    startTime: () => preprocessDate,
    endTime: () => preprocessDate,
    id: () => z.number(),
}).omit({
    createdAt: true,
    updatedAt: true,
    ghIssueNodeId: true,
    ghIssueNumber: true,
    projectId: true,
    id: true,
    creatorId: true,
});

export type ModifyTaskSchema = z.infer<typeof ModifyTask>;
