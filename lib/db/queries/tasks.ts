import { sql } from 'drizzle-orm';
import { tasks } from '../schema';
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

export async function createTask(projectId: number, title: string, startTime: string, endTime: string, ) {
    return await db.insert(tasks)
    .values({
        title: title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        projectId: projectId,
    })
    .returning({id: tasks.projectId});
}