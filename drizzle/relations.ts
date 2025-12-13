import { relations } from "drizzle-orm/relations";
import { groupe, categorieV2, projet, cerfaDiagnostic, cerfaDiagnostiqueur, cerfaMtrOuvrage, cerfaOperation, societe, etablissement, extrapolation, objets, operationProjet, pemd, natureV2, projetUser, userLegacy, qrcode, categorie, sousCategorie, structure, tagMail, tags, tagsAmiante, tagsPlomb, tagsStructure, tagsTermite } from "./schema";

export const categorieV2Relations = relations(categorieV2, ({one, many}) => ({
	groupe: one(groupe, {
		fields: [categorieV2.groupeId],
		references: [groupe.id]
	}),
	objets: many(objets),
}));

export const groupeRelations = relations(groupe, ({many}) => ({
	categorieV2s: many(categorieV2),
}));

export const cerfaDiagnosticRelations = relations(cerfaDiagnostic, ({one}) => ({
	projet: one(projet, {
		fields: [cerfaDiagnostic.projetId],
		references: [projet.id]
	}),
}));

export const projetRelations = relations(projet, ({one, many}) => ({
	cerfaDiagnostics: many(cerfaDiagnostic),
	cerfaDiagnostiqueurs: many(cerfaDiagnostiqueur),
	cerfaMtrOuvrages: many(cerfaMtrOuvrage),
	cerfaOperations: many(cerfaOperation),
	extrapolations: many(extrapolation),
	operationProjets: many(operationProjet),
	pemds: many(pemd),
	etablissement_idEtabId: one(etablissement, {
		fields: [projet.idEtabId],
		references: [etablissement.id],
		relationName: "projet_idEtabId_etablissement_id"
	}),
	etablissement_idEtablissementId: one(etablissement, {
		fields: [projet.idEtablissementId],
		references: [etablissement.id],
		relationName: "projet_idEtablissementId_etablissement_id"
	}),
	projetUsers: many(projetUser),
	structures: many(structure),
	tagMails: many(tagMail),
	tags_projetIdId: many(tags, {
		relationName: "tags_projetIdId_projet_id"
	}),
	tags_sidId: many(tags, {
		relationName: "tags_sidId_projet_id"
	}),
	tagsAmiantes: many(tagsAmiante),
	tagsPlombs: many(tagsPlomb),
	tagsStructures: many(tagsStructure),
	tagsTermites: many(tagsTermite),
}));

export const cerfaDiagnostiqueurRelations = relations(cerfaDiagnostiqueur, ({one}) => ({
	projet: one(projet, {
		fields: [cerfaDiagnostiqueur.projetId],
		references: [projet.id]
	}),
}));

export const cerfaMtrOuvrageRelations = relations(cerfaMtrOuvrage, ({one}) => ({
	projet: one(projet, {
		fields: [cerfaMtrOuvrage.projetId],
		references: [projet.id]
	}),
}));

export const cerfaOperationRelations = relations(cerfaOperation, ({one}) => ({
	projet: one(projet, {
		fields: [cerfaOperation.projetId],
		references: [projet.id]
	}),
}));

export const etablissementRelations = relations(etablissement, ({one, many}) => ({
	societe: one(societe, {
		fields: [etablissement.idSocieteId],
		references: [societe.id]
	}),
	projets_idEtabId: many(projet, {
		relationName: "projet_idEtabId_etablissement_id"
	}),
	projets_idEtablissementId: many(projet, {
		relationName: "projet_idEtablissementId_etablissement_id"
	}),
	userLegacies: many(userLegacy),
}));

export const societeRelations = relations(societe, ({many}) => ({
	etablissements: many(etablissement),
}));

export const extrapolationRelations = relations(extrapolation, ({one}) => ({
	projet: one(projet, {
		fields: [extrapolation.sidId],
		references: [projet.id]
	}),
}));

export const objetsRelations = relations(objets, ({one, many}) => ({
	categorieV2: one(categorieV2, {
		fields: [objets.categorieId],
		references: [categorieV2.id]
	}),
	pemds: many(pemd),
	structures: many(structure),
}));

export const operationProjetRelations = relations(operationProjet, ({one}) => ({
	projet: one(projet, {
		fields: [operationProjet.projetId],
		references: [projet.id]
	}),
}));

export const pemdRelations = relations(pemd, ({one, many}) => ({
	objet: one(objets, {
		fields: [pemd.objetId],
		references: [objets.id]
	}),
	projet: one(projet, {
		fields: [pemd.sidId],
		references: [projet.id]
	}),
	natureV2: one(natureV2, {
		fields: [pemd.natureId],
		references: [natureV2.id]
	}),
	qrcodes: many(qrcode),
}));

export const natureV2Relations = relations(natureV2, ({many}) => ({
	pemds: many(pemd),
	structures: many(structure),
}));

export const projetUserRelations = relations(projetUser, ({one}) => ({
	projet: one(projet, {
		fields: [projetUser.projetId],
		references: [projet.id]
	}),
	userLegacy: one(userLegacy, {
		fields: [projetUser.userId],
		references: [userLegacy.id]
	}),
}));

export const userLegacyRelations = relations(userLegacy, ({one, many}) => ({
	projetUsers: many(projetUser),
	tagMails: many(tagMail),
	etablissement: one(etablissement, {
		fields: [userLegacy.idEtabId],
		references: [etablissement.id]
	}),
}));

export const qrcodeRelations = relations(qrcode, ({one}) => ({
	pemd: one(pemd, {
		fields: [qrcode.tagId],
		references: [pemd.id]
	}),
}));

export const sousCategorieRelations = relations(sousCategorie, ({one}) => ({
	categorie: one(categorie, {
		fields: [sousCategorie.categorieId],
		references: [categorie.id]
	}),
}));

export const categorieRelations = relations(categorie, ({many}) => ({
	sousCategories: many(sousCategorie),
}));

export const structureRelations = relations(structure, ({one}) => ({
	objet: one(objets, {
		fields: [structure.objetId],
		references: [objets.id]
	}),
	projet: one(projet, {
		fields: [structure.sidId],
		references: [projet.id]
	}),
	natureV2: one(natureV2, {
		fields: [structure.natureId],
		references: [natureV2.id]
	}),
}));

export const tagMailRelations = relations(tagMail, ({one}) => ({
	projet: one(projet, {
		fields: [tagMail.projetIdId],
		references: [projet.id]
	}),
	userLegacy: one(userLegacy, {
		fields: [tagMail.userIdId],
		references: [userLegacy.id]
	}),
}));

export const tagsRelations = relations(tags, ({one}) => ({
	projet_projetIdId: one(projet, {
		fields: [tags.projetIdId],
		references: [projet.id],
		relationName: "tags_projetIdId_projet_id"
	}),
	projet_sidId: one(projet, {
		fields: [tags.sidId],
		references: [projet.id],
		relationName: "tags_sidId_projet_id"
	}),
}));

export const tagsAmianteRelations = relations(tagsAmiante, ({one}) => ({
	projet: one(projet, {
		fields: [tagsAmiante.sidId],
		references: [projet.id]
	}),
}));

export const tagsPlombRelations = relations(tagsPlomb, ({one}) => ({
	projet: one(projet, {
		fields: [tagsPlomb.sidId],
		references: [projet.id]
	}),
}));

export const tagsStructureRelations = relations(tagsStructure, ({one}) => ({
	projet: one(projet, {
		fields: [tagsStructure.sidId],
		references: [projet.id]
	}),
}));

export const tagsTermiteRelations = relations(tagsTermite, ({one}) => ({
	projet: one(projet, {
		fields: [tagsTermite.sidId],
		references: [projet.id]
	}),
}));