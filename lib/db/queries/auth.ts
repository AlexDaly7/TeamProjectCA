import { user } from '../schema';
import { eq } from 'drizzle-orm';
import db from '../index';
import * as z from 'zod';

export const zUser = z.object({
    userName: z.string(),
    groupId: z.number(),
});

export async function checkUser(userName: string) {
    return await db.select({
        field1: user.id
    })
    .from(user)
    .where(eq(user.name, userName));
}