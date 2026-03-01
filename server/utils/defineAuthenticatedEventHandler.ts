import { User } from 'better-auth';
import type { H3Event, H3EventContext } from 'h3';

type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: User;
    }
};

export default function defineAuthenticatedEventHandler<T extends EventHandlerRequest, D>(
    handler: EventHandler<T, D>,
): EventHandler<T, D> {
    return defineEventHandler<T>(async (event) => {
        if (!event.context.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            });
        }

        return handler(event as AuthenticatedEvent & T);
    });
}