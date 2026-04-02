import { and, eq } from "drizzle-orm";
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