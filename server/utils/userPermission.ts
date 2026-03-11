import { auth } from "~~/lib/auth";
import { type H3Event } from "h3";

// todo: make this check specific permissions in the function params
export async function ensureUserInOrg(event: H3Event, userId: string, organizationId: string) {
    const { success, error } = await auth.api.hasPermission({
        headers: event.headers,
        body: {
            permissions: {
                organization: [ 'update' ],
            },
            organizationId,
        },
    });

    if (error) {
        // todo: use logger
        console.log('error getting permissions for user', userId, organizationId);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
    
    if (!success) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Organization not found',
        });
    }
}

export async function getActiveOrganization(event: H3Event) {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session?.session.activeOrganizationId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const organization = await auth.api.getFullOrganization({
        headers: event.headers,
        query: {
            organizationId: session.session.activeOrganizationId,
        }
    });

    if (!organization) {
        throw createError({ statusCode: 404, statusMessage: 'Organization not found' });
    }

    return { organization };
}