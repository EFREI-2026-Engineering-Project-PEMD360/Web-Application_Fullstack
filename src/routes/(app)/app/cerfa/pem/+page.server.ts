import { db } from '$lib/server/db/client';
import { objets, categorieV2, groupe } from '$lib/server/db/schema';
import { eq, isNotNull, not } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Caractérisation PEM : Objets qui ne sont PAS des déchets (ou spécifiquement marqués comme PEM/Réemploi)
	// Ici nous prenons par défaut tout ce qui est marqué comme réemploi
	// Ou si vous préférez, tout ce qui n'est pas "deposeDechet" (à adapter selon logique métier)
	// Pour l'instant, on se base sur deposeReemlpoi existant
	const items = await db
		.select({
			id: objets.id,
			objet: objets.objet,
			categorie: categorieV2.categoriev2,
			groupe: groupe.groupe,
			unite: objets.unite,
			masseUnitaire: objets.masseUnitaire,
			etat: objets.deposeReemlpoi // Utilise le champ de réemploi comme état pour l'instant
		})
		.from(objets)
		.leftJoin(categorieV2, eq(objets.categorieId, categorieV2.id))
		.leftJoin(groupe, eq(categorieV2.groupeId, groupe.id))
		.where(isNotNull(objets.deposeReemlpoi)) // Filtrage simple: si une info réemploi existe
		.all();

	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	items.sort((a, b) => {
		const g = collator.compare(a.groupe || '', b.groupe || '');
		if (g !== 0) return g;
		const c = collator.compare(a.categorie || '', b.categorie || '');
		if (c !== 0) return c;
		return collator.compare(a.objet || '', b.objet || '');
	});

	return {
		items
	};
};
