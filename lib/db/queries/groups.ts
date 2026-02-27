import { and, eq } from 'drizzle-orm';
import db from '../index';
import { groupMembers, groups } from '../schema';

export async function createGroup(userId: string, groupName: string) {
    const inserted = await db.insert(groups).values({
        name: groupName,
        slug: await findUniqueSlug(groupName),
    }).returning();

    const result = inserted[0];
    if (inserted.length === 0 || !result) throw Error("Error creating group");

    await db.insert(groupMembers).values({
        groupId: result.id,
        userId: userId,
        role: 'owner',
    });

    return result.id;
}

export async function findGroupBySlug(slug: string) {
    return await db.query.groups.findFirst({
        where: eq(groups.slug, slug),
    });
}

export async function listUserGroups(userId: string) {
    return await db.query.groupMembers.findMany({
        where: eq(groupMembers.userId, userId),
        with: {
            group: {
                columns: {
                    name: true,
                    slug: true,
                }
            },
        }
    });
}

export async function getUserGroupPermissions(userId: string, groupId: number) {
    return await db.query.groupMembers.findFirst({
        where: and(
            eq(groupMembers.userId, userId),
            eq(groupMembers.groupId, groupId),
        )
    });
}

export async function getUserGroup(userId: string, groupId: number) {
    const userPermissions = await getUserGroupPermissions(userId, groupId);
    if (!userPermissions) return null;

    return await db.query.groups.findFirst({
        where: eq(groups.id, groupId),
    });
}

//export async function getProjectOwner(projectId: number) {
//    const user = await db.select({
//        field1: groupMembers,
//    }).from(groupMembers).where(groupMembers.)
//}

export async function addUserToGroup(userId: string, groupId: number) {
    return await db.insert(groupMembers).values({
        groupId: groupId,
        userId: userId,
        role: 'developer',
    });
}