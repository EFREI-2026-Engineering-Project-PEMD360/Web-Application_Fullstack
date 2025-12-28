import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db/client';
import { etablissement as etablissementTable, societe as societeTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { isAdmin } = await parent();

    if (!isAdmin) {
        throw redirect(303, '/app/unauthorized');
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
        throw error(400, 'ID invalide');
    }

    const results = await db.select().from(etablissementTable).where(eq(etablissementTable.id, id)).limit(1);

    if (results.length === 0) {
        throw error(404, 'Établissement non trouvé');
    }

    const etab = results[0];


    const societes = await db.select().from(societeTable);

    return {
        etablissement: etab,
        societes
    };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const id = parseInt(params.id);

        const data = {
            nom: formData.get('nom') as string,
            idSocieteId: parseInt(formData.get('idSocieteId') as string),
            raisonSocial: formData.get('raisonSocial') as string,
            rue: formData.get('rue') as string,
            cp: formData.get('cp') as string,
            ville: formData.get('ville') as string,
            tel: formData.get('tel') as string,
            fax: formData.get('fax') as string,
            email: formData.get('email') as string,
            siret: formData.get('siret') as string,
        };

        if (!data.nom || !data.idSocieteId || !data.siret) {
            return fail(400, { data, message: 'Veuillez remplir les champs obligatoires', success: false });
        }

        try {
            await db.update(etablissementTable)
                .set(data)
                .where(eq(etablissementTable.id, id));
        } catch (e) {
            console.error(e);
            return fail(500, { data, message: 'Erreur lors de la mise à jour', success: false });
        }

        throw redirect(303, `/app/admin/etablissements/${id}`);
    }
};
