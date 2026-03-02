import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function dbQuery(text: string, params?: any[]) {
    return pool.query(text, params);
}

console.log("DB URL exists:", !!process.env.DATABASE_URL);
