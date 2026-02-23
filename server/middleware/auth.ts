import { User } from "better-auth";
import { auth } from "~~/lib/auth"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as User;
});