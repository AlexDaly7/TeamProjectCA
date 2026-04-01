import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import z from 'zod';
import { organization } from './auth';
import { tasks } from './tasks';

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    
    organizationId: text("organization_id").notNull(),

    repoId: integer("repo_id").notNull(),
    repoName: text('repo_name').notNull(),
    repoOwner: text('repo_owner').notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
    organization: one(organization, {
        fields: [ projects.organizationId ],
        references: [ organization.id ],
    }),
    tasks: many(tasks),
}));

// Used on server
export const InsertProject = createInsertSchema(projects).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertProjectSchema = z.infer<typeof InsertProject>;


export const UpdateProject = createUpdateSchema(projects).omit({
    id: true,
    organizationId: true,
    repoId: true,
    repoName: true,
    repoOwner: true,
    createdAt: true,
    updatedAt: true,
});

export type UpdateProjectSchema = z.infer<typeof UpdateProject>;
