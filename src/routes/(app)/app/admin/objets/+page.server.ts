import { db } from '$lib/server/db/client';
import { objets, categorieV2 } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const objetsList = await db
		.select({
			id: objets.id,
			objet: objets.objet,
			categorieId: objets.categorieId,
			categorieName: categorieV2.categoriev2
		})
		.from(objets)
		.leftJoin(categorieV2, eq(objets.categorieId, categorieV2.id))
		.all();

	const categories = await db.select().from(categorieV2).all();

	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	objetsList.sort((a, b) => {
		const c = collator.compare(a.categorieName || '', b.categorieName || '');
		if (c !== 0) return c;
		return collator.compare(a.objet || '', b.objet || '');
	});

	categories.sort((a, b) => collator.compare(a.categoriev2 || '', b.categoriev2 || ''));

	return {
		objets: objetsList,
		categories
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const objetName = formData.get('objet') as string;
		const categorieId = Number(formData.get('categorieId'));

		if (!objetName || !categorieId) {
			return fail(400, { message: "Le nom de l'objet et la catégorie sont requis" });
		}

		try {
			await db.insert(objets).values({
				objet: objetName,
				categorieId: categorieId
			});

			return { success: true };
		} catch (e: any) {
			console.error('Error creating objet:', e);
			return fail(500, { message: 'Erreur lors de la création' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const objetName = formData.get('objet') as string;
		const categorieId = Number(formData.get('categorieId'));

		if (!id || !objetName || !categorieId) {
			return fail(400, { message: "ID, nom de l'objet et catégorie requis" });
		}

		try {
			await db
				.update(objets)
				.set({
					objet: objetName,
					categorieId: categorieId
				})
				.where(eq(objets.id, id));

			return { success: true };
		} catch (e: any) {
			console.error('Error updating objet:', e);
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
			await db.delete(objets).where(eq(objets.id, id));
			return { success: true };
		} catch (e: any) {
			console.error('Error deleting objet:', e);
			return fail(500, { message: 'Erreur lors de la suppression' });
		}
	}
};
