import { InsertTaskSchema, ModifyTaskSchema } from "~~/lib/db/schema";
import { tasksRepository } from "../repositories";
import { Result } from "#shared/types/results";

export async function insertTask(values: InsertTaskSchema): Promise<Result<null>> {
    const inserted = await tasksRepository.insertTask(values);

    if (inserted.length === 0) {
        return { data: null, error: new Error('Failed to insert task.') };
    }

    return { data: null, error: null };
}

// Read
export async function getTask(id: number) {
    return await tasksRepository.getTask(id);
}

export async function getTaskWithProject(id: number) {
    return await tasksRepository.getTaskWithProject(id);
}

export async function getTasksWithDepthAndPath(projectId: number) {
    return await tasksRepository.getTasksWithDepthAndPath(projectId);
}

// Update
export async function updateTask(taskId: number, values: ModifyTaskSchema): Promise<Result<null>> {
    const modified = await tasksRepository.modifyTask(taskId, values);

    if (modified.length === 0) {
        return { data: null, error: new Error('Task not found.') };
    }

    return { data: null, error: null };
}

// Delete
export async function deleteTask(id: number) {
    return await tasksRepository.deleteTask(id);
}