import { and, eq } from "drizzle-orm";
import db from "~~/lib/db";
import { account } from "~~/lib/db/schema";

export async function getGithubAccount(userId: string) {
    return await db.query.account.findFirst({
        where: and(
            eq(account.userId, userId),
            eq(account.providerId, 'github'),
        )
    });
}