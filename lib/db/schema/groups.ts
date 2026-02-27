import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { groupMembers } from './groupMembers';

export const groups = pgTable("groups", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const groupRelations = relations(groups, ({ many }) => ({ 
    members: many(groupMembers),
}));

export const InsertGroup = createInsertSchema(groups).omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
});

export type GroupSchema = typeof groups.$inferSelect;

export type InsertGroupSchema = z.infer<typeof InsertGroup>;