import { UpdateProjectSchema } from "~~/lib/db/schema";
import { projectRepository } from "../repositories";

// Read
export async function getProjectById(projectId: number) {
    return await projectRepository.getProjectById(projectId);
}

export async function getByIdForUser(projectId: number, userId: string) {
    const projectOrgInfo = await projectRepository.getByIdWithOrgMembers(projectId);
    if (!projectOrgInfo) return null;

    if (projectOrgInfo.organization.members.find((m) => m.userId === userId)) {
        return projectOrgInfo;
    } else {
        return null;
    }
}

// Update
export async function partialUpdate(projectId: number, organizationId: string, newBody: UpdateProjectSchema) {
    return await projectRepository.partialUpdate(projectId, organizationId, newBody);
}

// Delete
export async function deleteProject(projectId: number, organizationId: string) {
    return await projectRepository.deleteProject(projectId, organizationId);
}