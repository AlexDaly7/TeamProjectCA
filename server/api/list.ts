import { db } from "~~/lib/db";
import { exampleTable } from "~~/lib/db/schema";

export default defineEventHandler(async (_event) => {
    const results = await db
        .select()
        .from(exampleTable);

    return results;
});