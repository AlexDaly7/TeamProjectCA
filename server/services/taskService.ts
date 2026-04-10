import type { InsertTaskSchema, ModifyTaskSchema } from "~~/server/lib/db/schema";
import { taskAssigneesRepository, tasksRepository } from "../repositories";
import type { Result } from "#shared/types/results";

function normalizeAssigneeIds(assigneeIds?: string[]) {
    return [...new Set(assigneeIds ?? [])];
}

export async function insertTask(
    values: InsertTaskSchema,
    assigneeIds?: string[],
): Promise<Result<{ id: number }>> {
    const inserted = await tasksRepository.insertTask(values);

    if (inserted.length === 0) {
        return { data: null, error: new Error('Failed to insert task.') };
    }

    const insertedTask = inserted[0]!;
    const normalizedAssigneeIds = normalizeAssigneeIds(assigneeIds);

    if (normalizedAssigneeIds.length > 0) {
        await taskAssigneesRepository.insertTaskAssignees(
            normalizedAssigneeIds.map((userId) => ({
                taskId: insertedTask.id,
                userId,
            })),
        );
    }

    return { data: insertedTask, error: null };
}

// Read
export async function getTask(id: number) {
    return await tasksRepository.getTask(id);
}

export async function getTaskByGitHubIssueNodeId(ghIssueNodeId: string) {
    return await tasksRepository.getTaskByGitHubIssueNodeId(ghIssueNodeId);
}

export async function getTaskWithProject(id: number) {
    return await tasksRepository.getTaskWithProject(id);
}

export async function getTasksWithDepthAndPath(projectId: number) {
    const [tasks, assignees] = await Promise.all([
        tasksRepository.getTasksWithDepthAndPath(projectId),
        taskAssigneesRepository.getTaskAssigneesByProjectId(projectId),
    ]);

    const assigneesByTaskId = new Map<number, typeof assignees>();

    for (const assignee of assignees) {
        const existing = assigneesByTaskId.get(assignee.taskId);

        if (existing) {
            existing.push(assignee);
        } else {
            assigneesByTaskId.set(assignee.taskId, [assignee]);
        }
    }

    return tasks.map((task) => ({
        ...task,
        assignees: assigneesByTaskId.get(task.id) ?? [],
    }));
}

// Update
export async function updateTask(
    taskId: number,
    values: ModifyTaskSchema,
    assigneeIds?: string[],
): Promise<Result<null>> {
    const modified = await tasksRepository.modifyTask(taskId, values);

    if (modified.length === 0) {
        return { data: null, error: new Error('Task not found.') };
    }

    if (assigneeIds !== undefined) {
        const normalizedAssigneeIds = normalizeAssigneeIds(assigneeIds);

        await taskAssigneesRepository.deleteTaskAssigneesByTaskId(taskId);

        if (normalizedAssigneeIds.length > 0) {
            await taskAssigneesRepository.insertTaskAssignees(
                normalizedAssigneeIds.map((userId) => ({
                    taskId,
                    userId,
                })),
            );
        }
    }

    return { data: null, error: null };
}

// Delete
export async function deleteTask(id: number) {
    return await tasksRepository.deleteTask(id);
}
