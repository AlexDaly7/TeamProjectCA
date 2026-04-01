import { organizationRepository } from "../repositories";

export async function listProjectsWithDetails(organizationId: string) {
    return await organizationRepository.listProjectsWithDetails(organizationId);
}