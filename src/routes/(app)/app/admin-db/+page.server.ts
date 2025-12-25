import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/client';
import { userLegacy } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
  try {
    // Use Drizzle ORM to select all rows from the user_legacy table
    const users_legacy = await db.select().from(userLegacy);

    return {
      users_legacy
    };
  } catch (err: any) {
    console.error('Error loading users_legacy via Drizzle:', err && err.stack ? err.stack : err);
    return {
      users_legacy: [],
      error: 'Failed to load users_legacy'
    };
  }
};
