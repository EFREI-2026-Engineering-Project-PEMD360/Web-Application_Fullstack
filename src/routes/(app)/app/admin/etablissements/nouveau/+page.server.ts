import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db/client';
import { etablissement as etablissementTable, societe as societeTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ parent }) => {
    const { isAdmin } = await parent();

    if (!isAdmin) {
        throw redirect(303, '/app/unauthorized');
    }

    const societes = await db.select().from(societeTable);

    return {
        societes
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();

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
            const result = await db.insert(etablissementTable)
                .values(data)
                .returning({ insertedId: etablissementTable.id });

            if (result.length > 0) {
                throw redirect(303, `/app/admin/etablissements/${result[0].insertedId}`);
            }
        } catch (e) {
            if (e instanceof Response) throw e;
            console.error(e);
            return fail(500, { data, message: 'Erreur lors de la création', success: false });
        }

        throw redirect(303, '/app/admin/etablissements');
    }
};
