import { db } from './client';
import { users } from './schema';

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function insertUser(name: string, email: string) {
  return await db.insert(users).values({ name, email }).returning();
}
