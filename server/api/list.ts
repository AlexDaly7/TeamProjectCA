import db from "~~/lib/db";

export default defineEventHandler(async (_event) => {
    const results = await db.query.exampleTable.findMany();
    return results;
});