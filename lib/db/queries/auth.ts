import { user } from '../schema';
import { eq } from 'drizzle-orm';
import db from '../index';

export async function getUserByUsername(username: string) {
    return await db.query.user.findFirst({
        where: eq(user.name, username),
    });
}