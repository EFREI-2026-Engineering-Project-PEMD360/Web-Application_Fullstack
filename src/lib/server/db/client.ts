import { drizzle } from 'drizzle-orm/better-sqlite3';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle({ connection: { source: DATABASE_URL } });
