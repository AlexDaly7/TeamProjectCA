import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { groups } from './groups';
import { createInsertSchema } from 'drizzle-zod';
import type z from 'zod';

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    groupId: integer("group_id").notNull(),
    repoId: integer("repo_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
    group: one(groups, {
        fields: [ projects.groupId ],
        references: [ groups.id ],
    }),
}));

export const InsertProject = createInsertSchema(projects).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type ProjectSchema = typeof projects.$inferSelect;

export type InsertProjectSchema = z.infer<typeof InsertProject>;