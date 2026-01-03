import { db } from '$lib/server/db/client';
import { natureV2 } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const natures = await db.select().from(natureV2).all();
    return {
        natures
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const nature = formData.get('nature') as string;
        
        if (!nature) {
            return fail(400, { message: 'Le nom de la nature est requis' });
        }

        try {
            await db.insert(natureV2).values({
                nature,
                reutilisation: Number(formData.get('reutilisation')) || 0,
                recyclable: Number(formData.get('recyclable')) || 0,
                valorisationMatiere: Number(formData.get('valorisationMatiere')) || 0,
                valorisationEnergetique: Number(formData.get('valorisationEnergetique')) || 0,
                densite: formData.get('densite') ? Number(formData.get('densite')) : null,
                stockage: formData.get('stockage') as string || null,
                codeDechet: formData.get('codeDechet') ? Number(formData.get('codeDechet')) : null,
                ecoOrganismeRep: formData.get('ecoOrganismeRep') as string || null,
                incinerationSansValorisationEnergetique: Number(formData.get('incinerationSansValorisationEnergetique')) || 0,
                nonValorisation: Number(formData.get('nonValorisation')) || 0,
            });

            return { success: true };
        } catch (e: any) {
            console.error('Error creating nature:', e);
            return fail(500, { message: 'Erreur lors de la création' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const nature = formData.get('nature') as string;

        if (!id || !nature) {
            return fail(400, { message: 'ID et nom de la nature requis' });
        }

        try {
            await db.update(natureV2)
                .set({
                    nature,
                    reutilisation: Number(formData.get('reutilisation')) || 0,
                    recyclable: Number(formData.get('recyclable')) || 0,
                    valorisationMatiere: Number(formData.get('valorisationMatiere')) || 0,
                    valorisationEnergetique: Number(formData.get('valorisationEnergetique')) || 0,
                    densite: formData.get('densite') ? Number(formData.get('densite')) : null,
                    stockage: formData.get('stockage') as string || null,
                    codeDechet: formData.get('codeDechet') ? Number(formData.get('codeDechet')) : null,
                    ecoOrganismeRep: formData.get('ecoOrganismeRep') as string || null,
                    incinerationSansValorisationEnergetique: Number(formData.get('incinerationSansValorisationEnergetique')) || 0,
                    nonValorisation: Number(formData.get('nonValorisation')) || 0,
                })
                .where(eq(natureV2.id, id));

            return { success: true };
        } catch (e: any) {
            console.error('Error updating nature:', e);
            return fail(500, { message: 'Erreur lors de la mise à jour' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) {
            return fail(400, { message: 'ID requis' });
        }

        try {
            await db.delete(natureV2).where(eq(natureV2.id, id));
            return { success: true };
        } catch (e: any) {
            console.error('Error deleting nature:', e);
            return fail(500, { message: 'Erreur lors de la suppression' });
        }
    }
};
