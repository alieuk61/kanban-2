import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function dbQuery(text: string, params?: unknown[]) {
    return pool.query(text, params);
}

console.log("DB URL exists:", !!process.env.DATABASE_URL);
