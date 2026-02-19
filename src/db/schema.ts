import { integer, pgTable } from "drizzle-orm/pg-core";

export const testTable =  {
    id: integer().primaryKey()
}