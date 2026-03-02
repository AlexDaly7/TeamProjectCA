import { integer, pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { groups } from './groups';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

export const groupRole = pgEnum('groupRole', ['owner', 'developer', 'reader']);

export const groupMembers = pgTable("groupMembers", {
    groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: groupRole().notNull(),
}, (table) => [
    primaryKey({ columns: [ table.groupId, table.userId ] }),
]);

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({ 
    group: one(groups, {
        fields: [ groupMembers.groupId ],
        references: [ groups.id ],
    }),
    user: one(user, {
        fields: [ groupMembers.userId ],
        references: [ user.id ],
    }),
}));



export const InsertGroupMember = createInsertSchema(groupMembers).omit({
    userId: true,
}).extend({
    userName: z.string(),
});

export type GroupMemberSchema = typeof groups.$inferSelect;

export type InsertGroupMember = z.infer<typeof InsertGroupMember>;
