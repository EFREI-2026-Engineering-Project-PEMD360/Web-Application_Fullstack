import { drizzle } from 'drizzle-orm/d1';
export interface Env {
  <BINDING_NAME>: D1Database;
}

export const db = drizzle(env.<BINDING_NAME>);
