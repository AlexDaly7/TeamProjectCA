import { count, eq, getTableColumns, max } from 'drizzle-orm';
import { projects, tasks } from '~~/server/lib/db/schema';
import db from '../lib/db';

export async function listProjectsWithDetails(organizationId: string) {
    return await db
        .select({
            ...getTableColumns(projects),
            totalTasks: count(tasks.id),
            lastTaskUpdatedAt: max(tasks.updatedAt),
        })
        .from(projects)
        .leftJoin(tasks, eq(tasks.projectId, projects.id))
        .where(eq(projects.organizationId, organizationId))
        .groupBy(projects.id);
}
