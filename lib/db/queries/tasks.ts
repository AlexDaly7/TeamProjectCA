import { sql } from 'drizzle-orm';
import { tasks, type InsertTaskSchema } from '../schema';
import db from '../index';

export async function getTasks(projectId: number) {
    return await db.execute(sql`
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
        ORDER_BY path
    `);
}

export async function createTask(values: InsertTaskSchema) {
    return await db.insert(tasks)
        .values(values)
        .returning({ id: tasks.projectId });
}