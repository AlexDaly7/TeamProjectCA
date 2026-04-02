import { eq, sql } from "drizzle-orm";
import db from "../lib/db";
import { tasks } from "~~/server/lib/db/schema";
import type { InsertTaskSchema, ModifyTaskSchema, TasksSchema } from "~~/server/lib/db/schema";

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

export async function getTasksWithDepthAndPath(
    projectId: number,
): Promise<(TasksSchema & { depth: number; path: number[] })[]> {
    const snakeToCamel = (text: string) =>
        text.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

    const mapKeys = <T>(row: Record<string, unknown>): T =>
        Object.fromEntries(
            Object.entries(row).map(([k, v]) => [snakeToCamel(k), v]),
        ) as T;

    try {
        const result = await db.execute(sql`
            WITH RECURSIVE task_tree AS (
                -- top-level tasks
                SELECT *, 0 AS depth, ARRAY[id] AS path
                FROM tasks
                WHERE parent_id is NULL AND project_id = ${projectId}

                UNION ALL

                -- recurse children
                SELECT t.*, tt.depth + 1, tt.path || t.id
                FROM tasks t
                INNER JOIN task_tree tt ON t.parent_id = tt.id
            )
            SELECT * FROM task_tree
            ORDER BY path
        `);

        return result.rows.map((row) =>
            mapKeys<TasksSchema & { depth: number; path: number[] }>(row),
        );
    } catch (error) {
        throw error;
    }
}
export type TasksWithDepth = Awaited<ReturnType<typeof getTasksWithDepthAndPath>>;

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
