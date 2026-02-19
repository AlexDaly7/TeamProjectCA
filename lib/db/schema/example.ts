import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const exampleTable = pgTable('example_table', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
});

export type InsertUser = typeof exampleTable.$inferInsert;
export type SelectUser = typeof exampleTable.$inferSelect;