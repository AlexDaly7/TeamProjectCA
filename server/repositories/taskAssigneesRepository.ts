import { eq, inArray } from "drizzle-orm";
import db from "../lib/db";
import { taskAssignees, tasks } from "~~/server/lib/db/schema";
import type { InsertTaskAssigneeSchema } from "~~/server/lib/db/schema";

// Create
export async function insertTaskAssignees(values: InsertTaskAssigneeSchema[]) {
    if (values.length === 0) return [];
    
    return await db
        .insert(taskAssignees)
        .values(values)
        .returning({ taskId: taskAssignees.taskId, userId: taskAssignees.userId });
}

// Delete all assignees for a task
export async function deleteTaskAssigneesByTaskId(taskId: number) {
    return await db
        .delete(taskAssignees)
        .where(eq(taskAssignees.taskId, taskId))
        .returning({ taskId: taskAssignees.taskId, userId: taskAssignees.userId });
}

// Get assignees for a task
export async function getTaskAssignees(taskId: number) {
    return await db.query.taskAssignees.findMany({
        where: eq(taskAssignees.taskId, taskId),
        with: {
            user: {
                columns: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    });
}

export async function getTaskAssigneesByTaskIds(taskIds: number[]) {
    if (taskIds.length === 0) return [];

    return await db.query.taskAssignees.findMany({
        where: inArray(taskAssignees.taskId, taskIds),
        with: {
            user: {
                columns: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });
}

export async function getTaskAssigneesByProjectId(projectId: number) {
    const taskRows = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(eq(tasks.projectId, projectId));

    return await getTaskAssigneesByTaskIds(taskRows.map((task) => task.id));
}
