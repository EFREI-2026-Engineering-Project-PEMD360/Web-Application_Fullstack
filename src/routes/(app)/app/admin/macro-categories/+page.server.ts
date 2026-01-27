import { db } from '$lib/server/db/client';
import { groupe } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const groupes = await db.select().from(groupe).all();

	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
	groupes.sort((a, b) => collator.compare(a.groupe || '', b.groupe || ''));

	return {
		groupes
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const groupeName = formData.get('groupe') as string;

		if (!groupeName) {
			return fail(400, { message: 'Le nom du groupe est requis' });
		}

		try {
			await db.insert(groupe).values({
				groupe: groupeName
			});

			return { success: true };
		} catch (e: any) {
			console.error('Error creating groupe:', e);
			return fail(500, { message: 'Erreur lors de la création' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const groupeName = formData.get('groupe') as string;

		if (!id || !groupeName) {
			return fail(400, { message: 'ID et nom du groupe requis' });
		}

		try {
			await db
				.update(groupe)
				.set({
					groupe: groupeName
				})
				.where(eq(groupe.id, id));

			return { success: true };
		} catch (e: any) {
			console.error('Error updating groupe:', e);
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
			await db.delete(groupe).where(eq(groupe.id, id));
			return { success: true };
		} catch (e: any) {
			console.error('Error deleting groupe:', e);
			return fail(500, { message: 'Erreur lors de la suppression' });
		}
	}
};
