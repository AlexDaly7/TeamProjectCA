import { eq } from 'drizzle-orm';
import db from '../../db';
import { projects } from '../schema';

export async function createProject(
    repoId: number,
    repoName: string,
    repoOwner: string,
    title: string,
    groupId: number
) {
    return await db
        .insert(projects)
        .values({ repoId, title, groupId, repoName, repoOwner })
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

export async function getUserProject(userId: string, projectId: number) {
    const projectGroupInfo = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
            group: {
                with: {
                    members: {
                        columns: {
                            userId: true,
                        }
                    },
                }
            }
        }
    });

    if (!projectGroupInfo) return null;

    if (projectGroupInfo.group.members.find((m) => m.userId === userId)) {
        return projectGroupInfo;
    } else {
        return null;
    }
}