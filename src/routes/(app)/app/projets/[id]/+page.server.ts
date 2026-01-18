import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/client';
import { projet, etablissement, user, tagMail, tagsAmiante, tagsPlomb, tagsTermite, tagsStructure, pemd, groupe, categorieV2, objets } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params;
    const currentUser = locals.user;

    if (!currentUser) {
        throw error(401, 'Non autorisé');
    }

    const result = await db.select().from(projet).where(eq(projet.id, id));
    const project = result[0];

    if (!project) {
        throw error(404, 'Projet non trouvé');
    }

    // Vérifier que l'utilisateur a accès à ce projet (admin ou même société)
    if (currentUser.role !== 'admin') {
        const userWithSociete = await db.select().from(user).where(eq(user.id, currentUser.id));
        const societeId = userWithSociete[0]?.societeId;

        if (societeId) {
            // Récupérer les établissements de la société
            const etablissements = await db.select({ id: etablissement.id })
                .from(etablissement)
                .where(eq(etablissement.idSocieteId, societeId));

            const etablissementIds = etablissements.map(e => e.id);

            if (!etablissementIds.includes(project.idEtabId)) {
                throw error(403, 'Accès non autorisé à ce projet');
            }
        }
    }

    // Load tags for this project
    const tags = await db.select().from(tagMail).where(eq(tagMail.projetIdId, id));
    const amianteTags = await db.select().from(tagsAmiante).where(eq(tagsAmiante.sidId, id));
    const plombTags = await db.select().from(tagsPlomb).where(eq(tagsPlomb.sidId, id));
    const termiteTags = await db.select().from(tagsTermite).where(eq(tagsTermite.sidId, id));
    const structureTags = await db.select().from(tagsStructure).where(eq(tagsStructure.sidId, id));
    const pemdTags = await db.select().from(pemd).where(eq(pemd.sidId, id));

    // Build facets for PEMD (groupe -> categorie -> objet) to drive UI filters/autocomplete
    const pemdFacets = await db
        .select({
            groupeId: groupe.id,
            groupeName: groupe.groupe,
            categorieId: categorieV2.id,
            categorieName: categorieV2.categoriev2,
            objetId: objets.id,
            objetName: objets.objet
        })
        .from(pemd)
        .leftJoin(objets, eq(pemd.objetId, objets.id))
        .leftJoin(categorieV2, eq(objets.categorieId, categorieV2.id))
        .leftJoin(groupe, eq(categorieV2.groupeId, groupe.id))
        .where(eq(pemd.sidId, id))
        .orderBy(groupe.groupe, categorieV2.categoriev2, objets.objet);

    // Also load all groups and all categorie_v2 (master lists) to power the autocomplete.
    const allGroups = await db
        .select({ id: groupe.id, name: groupe.groupe })
        .from(groupe)
        .orderBy(groupe.groupe);

    const categoriesV2 = await db
        .select({ id: categorieV2.id, name: categorieV2.categoriev2, groupeId: categorieV2.groupeId })
        .from(categorieV2)
        .orderBy(categorieV2.categoriev2);

    const allPemdObjects = await db
        .select({ id: objets.id, name: objets.objet, categorieId: objets.categorieId })
        .from(objets)
        .orderBy(objets.objet);

    return {
        projet: project,
        tags: tags,
        amianteTags: amianteTags,
        plombTags: plombTags,
        termiteTags: termiteTags,
        structureTags: structureTags,
        pemdTags: pemdTags,
        pemdFacets: pemdFacets,
        groups: allGroups,
        categoriesV2: categoriesV2,
        allPemdObjects: allPemdObjects,
        matterportSdkKey: env.MATTERPORT_SDK_KEY
    };
};
