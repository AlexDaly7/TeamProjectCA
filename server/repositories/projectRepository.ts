import { and, eq } from "drizzle-orm";
import db from "~~/lib/db";
import { projects, type UpdateProjectSchema } from "~~/lib/db/schema";


// Read
export async function getProjectById(projectId: number) {
    return await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
}

export async function getByIdWithOrgMembers(projectId: number) {
    return await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
            organization: {
                with: {
                    members: true,
                }
            }
        }
    })
}

// Update
export async function partialUpdate(projectId: number, organizationId: string, newValues: UpdateProjectSchema) {
    return await db
        .update(projects)
        .set(newValues)
        .where(and(
            eq(projects.id, projectId),
            eq(projects.organizationId, organizationId)
        ))
        .returning();
}

// Delete
export async function deleteProject(projectId: number, organizationId: string) {
    return await db
        .delete(projects)
        .where(and(
            eq(projects.id, projectId),
            eq(projects.organizationId, organizationId)
        ))
        .returning();
}