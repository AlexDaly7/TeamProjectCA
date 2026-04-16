import { createEvent, H3Event } from 'h3';
import { Body, createRequest, createResponse, Headers, Params, Query, RequestMethod } from 'node-mocks-http';

export function createMockEvent(data: {
    url?: string;
    method?: RequestMethod;
    body?: Body;
    headers?: Headers;
    params?: Params;
    query?: Query;
}): H3Event {
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

    const event = createEvent(req, res);

    // H3 includes this on all event objects
    if (data.params) {
        event.context.params = data.params;
    }

    return event;
}
