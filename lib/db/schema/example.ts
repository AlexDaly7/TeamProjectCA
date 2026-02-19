import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const exampleTable = pgTable('example_table', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
});

export type InsertExample = typeof exampleTable.$inferInsert;
export type SelectExample = typeof exampleTable.$inferSelect;