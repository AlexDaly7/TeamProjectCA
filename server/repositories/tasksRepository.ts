import { eq } from "drizzle-orm";
import db from "~~/lib/db";
import { InsertTaskSchema, ModifyTaskSchema, tasks } from "~~/lib/db/schema";

// Create
export async function insertTask(values: InsertTaskSchema) {
    return await db
        .insert(tasks)
        .values(values)
        .returning({ id: tasks.id });
}

// Read
export async function getTask(id: number) {
    return await db.query.tasks.findFirst({
        where: eq(tasks.id, id),
    });
}

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
            },
            creator: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

// Update
export async function modifyTask(taskId: number, values: ModifyTaskSchema) {
    return await db
        .update(tasks)
        .set(values)
        .where(eq(tasks.id, taskId))
        .returning({ id: tasks.id });
}

// Delete
export async function deleteTask(id: number) {
    return await db
        .delete(tasks)
        .where(eq(tasks.id, id))
        .returning({ id: tasks.id });
}