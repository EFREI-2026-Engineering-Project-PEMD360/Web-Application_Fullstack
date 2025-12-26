import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/client';
import { etablissement } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, parent }) => {
    const { isAdmin } = await parent();

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin) {
        throw redirect(303, '/app/unauthorized');
    }

    const etablissements = await db.select().from(etablissement);

    return {
        etablissements
    };
};
