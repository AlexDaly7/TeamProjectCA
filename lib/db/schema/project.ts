import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
export default const projectTable = pgTable("project", {
    id: serial("id").primaryKey(),
    title: varchar(40).notNull()
});