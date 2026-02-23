import { integer, pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { groups } from './groups';

export const groupRole = pgEnum('groupRole', ['owner', 'developer', 'reader']);

export const groupMembers = pgTable("groupMembers", {
    groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: groupRole().notNull(),
}, (table) => [
    primaryKey({ columns: [ table.groupId, table.userId ] }),
]);