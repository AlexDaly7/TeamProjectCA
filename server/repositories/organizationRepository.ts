import { count, eq, getTableColumns, max, sql } from "drizzle-orm";
import db from "~~/lib/db";
import { projects, tasks } from "~~/lib/db/schema";

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