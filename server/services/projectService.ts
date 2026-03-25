import { UpdateProjectSchema } from "~~/lib/db/schema";
import { projectRepository } from "../repositories";

export async function getProjectById(projectId: number) {
    return await projectRepository.getProjectById(projectId);
}

export async function partialUpdate(projectId: number, organizationId: string, newBody: UpdateProjectSchema) {
    return await projectRepository.partialUpdate(projectId, organizationId, newBody);
}

export async function deleteProject(projectId: number, organizationId: string) {
    return await projectRepository.deleteProject(projectId, organizationId);
}