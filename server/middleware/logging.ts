export default defineEventHandler((event) => {
    const start = Date.now();
    const { method, url } = event.node.req;

    event.node.res.on('finish', () => {
        const duration = Date.now() - start;
        const status = event.node.res.statusCode;

        const statusColor =
            status >= 500
                ? '\x1b[31m' // red
                : status >= 400
                  ? '\x1b[33m' // yellow
                  : status >= 300
                    ? '\x1b[36m' // cyan
                    : '\x1b[32m'; // green

        const reset = '\x1b[0m';
        const dim = '\x1b[2m';
        const bold = '\x1b[1m';

        console.log(
            `${bold}${method}${reset} ${url} ` + `${statusColor}${status}${reset} ` + `${dim}${duration}ms${reset}`,
        );
    });
});
