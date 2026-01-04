import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/client';
import { projet } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const projets = await db.select().from(projet).orderBy(desc(projet.dateDemarrage));

	return {
		projets
	};
};