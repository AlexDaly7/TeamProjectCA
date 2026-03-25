import { eq } from "drizzle-orm";
import db from "~~/lib/db";
import { tasks } from "~~/lib/db/schema";

export async function getTaskWithProject(id: number) {
    return await db.query.tasks.findFirst({
        where: eq(tasks.id, id),
        with: {
            project: {
                columns: {
                    id: true,
                    organizationId: true,
                    repoOwner: true,
                    repoName: true,
                }
            }
        }
    });
}

export async function deleteTask(id: number) {
    return await db
        .delete(tasks)
        .where(eq(tasks.id, id))
        .returning();
}