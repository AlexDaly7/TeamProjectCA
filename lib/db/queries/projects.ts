import { and, eq } from 'drizzle-orm';
import db from '../../db';
import { projects } from '../schema';

export async function createProject(
    repoId: number,
    repoName: string,
    repoOwner: string,
    title: string,
    organizationId: string
) {
    const [ project ] = await db
        .insert(projects)
        .values({ repoId, title, organizationId, repoName, repoOwner })
        .returning({ id: projects.id });

    return project;
}

export async function getProject(projectId: number) {
    return await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });
}

export async function getRepoId(projectId: number) {
    return await db.select({
        field1: projects.repoId
    }).from(projects)
    .where(eq(projects.id, projectId));
}

export async function listProjects(organizationId: string) {
    return await db.query.projects.findMany({
        where: eq(projects.organizationId, organizationId),
    });
}

export async function getUserProject(userId: string, projectId: number) {
    const projectGroupInfo = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
            organization: {
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

    if (projectGroupInfo.organization.members.find((m) => m.userId === userId)) {
        return projectGroupInfo;
    } else {
        return null;
    }
}

export async function getProjectInOrg(projectId: number, organizationId: string) {
    return await db.query.projects.findFirst({
        where: and(
            eq(projects.id, projectId),
            eq(projects.organizationId, organizationId),
        ),
    });
}