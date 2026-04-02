import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from './schema';
import env from "../env";

const sql = neon(env.DATABASE_URL);
const db = drizzle({ 
    client: sql,
    casing: 'snake_case',
    schema,
});

export default db;