import { auth } from "~~/server/lib/auth/auth";
import { type H3Event } from "h3";
import { ac } from "~~/server/lib/auth/auth-permissions";

// -readonly strips modifier, iterator unwraps readonly
type Writeable<T> = { -readonly [K in keyof T]: T[K] extends readonly (infer U)[] ? U[] : T[K] };
type Permissions = Partial<Writeable<Parameters<typeof ac.newRole>[0]>>;

export async function ensureOrganizationPermission(
    event: H3Event,
    organizationId: string,
    permissions: Permissions,
) {
    const { success, error } = await auth.api.hasPermission({
        headers: event.headers,
        body: {
            organizationId,
            permissions,
        }
    });

    if (error) {
        console.error('Permissions check failed', { organizationId, permissions, error });

        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    if (!success) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Organization not found',
        });
    }
}