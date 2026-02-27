import { sql } from 'drizzle-orm';
import { tasks, type InsertTaskSchema, type TasksSchema } from '../schema';
import db from '../index';

export async function getTasks(projectId: number): Promise<(TasksSchema & { depth: number, path: number[] })[]> {
    const snakeToCamel = (text: string) => text.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

    const mapKeys = <T>(row: Record<string, unknown>): T =>                                                                                                                                     
        Object.fromEntries(Object.entries(row).map(([k, v]) => [snakeToCamel(k), v])) as T;

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
            mapKeys<(TasksSchema & { depth: number, path: number[] })>(row)
        );
    } catch (error) {
        throw error;
    }
}

export async function createTask(values: InsertTaskSchema) {
    return await db.insert(tasks)
        .values(values)
        .returning({ id: tasks.projectId });
}