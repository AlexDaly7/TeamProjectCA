import { createEvent, H3Event, type H3EventContext } from 'h3';
import {
    type Body,
    createRequest,
    createResponse,
    type Headers,
    type Params,
    type Query,
    type RequestMethod,
} from 'node-mocks-http';
import type { User } from 'better-auth';

type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user?: User;
    };
};

export function createMockEvent(data: {
    url?: string;
    method?: RequestMethod;
    body?: Body;
    headers?: Headers;
    params?: Params;
    query?: Query;
    user?: User;
}): AuthenticatedEvent {
    const req = createRequest({
        url: data.url,
        headers: {
            'content-type': 'application/json',
            ...data.headers,
        },
        method: data.method ?? 'POST',
        body: data.body,
        params: data.params,
        query: data.query,
    });

    const res = createResponse();

    const event = createEvent(req, res) as AuthenticatedEvent;

    // H3 includes this on all event objects
    if (data.params) {
        event.context.params = data.params;
    }

    if (data.user) {
        event.context.user = data.user;
    }

    return event;
}
