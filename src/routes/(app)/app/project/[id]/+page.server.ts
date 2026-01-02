import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { projet } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    const result = await db.select().from(projet).where(eq(projet.id, id));
    const project = result[0];


    if (!project) {
        throw error(404, 'Projet non trouvé');
    }

    return {
        projet: project
    };
};
