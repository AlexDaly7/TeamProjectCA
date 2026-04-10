import { and, eq, inArray } from "drizzle-orm";
import { account } from "~~/server/lib/db/schema";
import db from "../lib/db";

export async function getGithubAccount(userId: string) {
    return await db.query.account.findFirst({
        where: and(
            eq(account.userId, userId),
            eq(account.providerId, 'github'),
        )
    });
}

export async function getGithubAccounts(userIds: string[]) {
    if (userIds.length === 0) return [];

    return await db.query.account.findMany({
        where: and(
            inArray(account.userId, userIds),
            eq(account.providerId, 'github'),
        ),
    });
}
