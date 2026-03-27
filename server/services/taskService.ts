import { tasksRepository } from "../repositories";

export async function getTask(id: number) {
    return await tasksRepository.getTask(id);
}

export async function getTaskWithProject(id: number) {
    return await tasksRepository.getTaskWithProject(id);
}

export async function deleteTask(id: number) {
    return await tasksRepository.deleteTask(id);
}