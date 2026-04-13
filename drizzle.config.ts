import { defineConfig } from 'drizzle-kit';
import env from './server/lib/env';

export default defineConfig({
    out: './server/lib/db/migrations',
    schema: './server/lib/db/schema',
    casing: 'snake_case',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
