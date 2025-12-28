import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/client';
import { etablissement as etablissementTable, societe as societeTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
    const { isAdmin } = await parent();

    if (!isAdmin) {
        throw redirect(303, '/app/unauthorized');
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
        throw error(400, 'ID invalide');
    }

    const results = await db
        .select()
        .from(etablissementTable)
        .leftJoin(societeTable, eq(etablissementTable.idSocieteId, societeTable.id))
        .where(eq(etablissementTable.id, id))
        .limit(1);

    if (results.length === 0) {
        throw error(404, 'Établissement non trouvé');
    }

    return {
        etablissement: results[0].etablissement,
        societe: results[0].societe
    };
};
