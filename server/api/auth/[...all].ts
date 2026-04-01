import { auth } from '~~/server/lib/auth/auth';

export default defineEventHandler(async (event) => {
    return auth.handler(toWebRequest(event));
});