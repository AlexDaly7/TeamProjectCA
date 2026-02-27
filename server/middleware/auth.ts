import { User } from "better-auth";
import { auth } from "~~/lib/auth"

const UNAUTHED_ONLY_ROUTES = ['/'];

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as User;

    // Don't do route redirects with API routes.
    if (event.path.startsWith('/api/')) {
        return;
    }

    const user = session?.user;

    if (user) {
        // send authed users from landing to dashboard
        if (UNAUTHED_ONLY_ROUTES.includes(event.path)) {
            return sendRedirect(event, '/dashboard', 302);
        }
    } else {
        // Redirect unauthed users away from protected pages
        if (event.path.startsWith('/dashboard')) {
            return sendRedirect(event, '/', 302);
        }
    }
});