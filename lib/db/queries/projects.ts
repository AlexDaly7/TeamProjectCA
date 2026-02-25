import { eq } from 'drizzle-orm';
import db from '../../db';
import { projects } from '../schema';

export async function createProject(repoId: number, title: string, groupId: number) {
    return await db
        .insert(projects)
        .values({ repoId, title, groupId })
        .returning({ id: projects.id })
}

export async function getProject(projectId: number) {
    return await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });
}

export async function listProjects(groupId: number) {
    return await db.query.projects.findMany({
        where: eq(projects.groupId, groupId),
    });
}