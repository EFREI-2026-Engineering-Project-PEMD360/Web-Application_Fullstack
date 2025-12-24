import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/client';
import { userLegacy } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
  try {
    const user_legacy = await db.select().from(userLegacy);

    return {
      user_legacy
    };

  } catch (err: any) {
    console.error('Error loading user_legacy via Drizzle:', err && err.stack ? err.stack : err);
    return {
      user_legacy: [],
      error: 'Failed to load user_legacy'
    };
  }
};
