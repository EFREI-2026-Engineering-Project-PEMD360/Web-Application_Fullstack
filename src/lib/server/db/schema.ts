import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex, numeric, real, primaryKey } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));


export const categorieV2 = sqliteTable("categorie_v2", {
  id: integer().primaryKey({ autoIncrement: true }),
  groupeId: integer("groupe_id").notNull().references(() => groupe.id),
  categoriev2: text({ length: 255 }).notNull(),
},
  (table) => [
    index("IDX_F3A71D727A45358C").on(table.groupeId),
  ]);

export const cerfaDiagnostic = sqliteTable("cerfa_diagnostic", {
  id: integer().primaryKey({ autoIncrement: true }),
  projetId: text("projet_id", { length: 50 }).references(() => projet.id),
  derniereVisite: numeric("derniere_visite"),
  batNonVisite: text("bat_non_visite"),
  raisonsNePasVisite: text("raisons_ne_pas_visite"),
  desordres: integer(),
  precaution: integer(),
  "documentConsultés": text("document_consultés"),
  batVisite: text("bat_visite"),
},
  (table) => [
    uniqueIndex("UNIQ_69DB1259C18272").on(table.projetId),
  ]);

export const cerfaDiagnostiqueur = sqliteTable("cerfa_diagnostiqueur", {
  id: integer().primaryKey({ autoIncrement: true }),
  projetId: text("projet_id", { length: 50 }).references(() => projet.id),
  nomPerPhy: text("nom_per_phy", { length: 255 }),
  prenomPerPhy: text("prenom_per_phy", { length: 255 }),
  nomPerMorale: text("nom_per_morale", { length: 255 }),
  siretSiren: text("siret_siren", { length: 255 }),
  adresse: text({ length: 255 }),
  cp: text({ length: 255 }),
  commune: text({ length: 255 }),
  engagementAssurance: integer("engagement_assurance"),
  nomAssurance: text("nom_assurance", { length: 255 }),
  numeroPolice: text("numero_police", { length: 255 }),
  dateDebutAssurance: numeric("date_debut_assurance"),
  dateFinAssurance: numeric("date_fin_assurance"),
  competences: integer(),
},
  (table) => [
    uniqueIndex("UNIQ_3ADF2D26C18272").on(table.projetId),
  ]);

export const cerfaMtrOuvrage = sqliteTable("cerfa_mtr_ouvrage", {
  id: integer().primaryKey({ autoIncrement: true }),
  projetId: text("projet_id", { length: 50 }).references(() => projet.id),
  nomPerPhy: text("nom_per_phy", { length: 255 }),
  prenomPerPhy: text("prenom_per_phy", { length: 255 }),
  nomPerMorale: text("nom_per_morale", { length: 255 }),
  siretSiren: text("siret_siren", { length: 255 }),
  adresse: text({ length: 255 }),
  cp: real(),
  commune: text({ length: 255 }),
},
  (table) => [
    uniqueIndex("UNIQ_14B224E0C18272").on(table.projetId),
  ]);

export const cerfaOperation = sqliteTable("cerfa_operation", {
  id: integer().primaryKey({ autoIncrement: true }),
  projetId: text("projet_id", { length: 50 }).references(() => projet.id),
  adresse: text({ length: 500 }),
  cp: text({ length: 255 }),
  commune: text({ length: 255 }),
  dateDeDebut: numeric("date_de_debut"),
  dateDeFin: numeric("date_de_fin"),
  operation: text(),
  nbBatDemolition: real("nb_bat_demolition"),
  surfaceADemolir: real("surface_a_demolir"),
  nbBatRenovation: real("nb_bat_renovation"),
  surfaceARenover: real("surface_a_renover"),
  typologieBat: text("typologie_bat"),
  datePermisDeConstruire: numeric("date_permis_de_construire"),
  operationSoumis: text("operation_soumis"),
},
  (table) => [
    uniqueIndex("UNIQ_B7E4EBE0C18272").on(table.projetId),
  ]);

export const dechets = sqliteTable("dechets", {
  id: integer().primaryKey({ autoIncrement: true }),
  dechet: text({ length: 100 }).notNull(),
});

export const doctrineMigrationVersions = sqliteTable("doctrine_migration_versions", {
  version: text({ length: 191 }).primaryKey().notNull(),
  executedAt: numeric("executed_at"),
  executionTime: integer("execution_time"),
});

export const etablissement = sqliteTable("etablissement", {
  id: integer().primaryKey({ autoIncrement: true }),
  idSocieteId: integer("id_societe_id").notNull().references(() => societe.id),
  nom: text({ length: 255 }).notNull(),
  raisonSocial: text("raison_social", { length: 50 }).notNull(),
  rue: text({ length: 255 }).notNull(),
  cp: text({ length: 5 }).notNull(),
  ville: text({ length: 255 }).notNull(),
  tel: text({ length: 255 }).notNull(),
  fax: text({ length: 255 }).notNull(),
  email: text({ length: 255 }).notNull(),
  siret: text({ length: 255 }).notNull(),
},
  (table) => [
    index("IDX_20FD592C597DF5D4").on(table.idSocieteId),
  ]);

export const extrapolation = sqliteTable("extrapolation", {
  id: integer().primaryKey({ autoIncrement: true }),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  extrapolationData: text("extrapolation_data").notNull(),
  constitution: text({ length: 10000 }),
},
  (table) => [
    uniqueIndex("UNIQ_284FF9E58512B786").on(table.sidId),
  ]);

export const groupe = sqliteTable("groupe", {
  id: integer().primaryKey({ autoIncrement: true }),
  groupe: text({ length: 255 }).notNull(),
});

export const label = sqliteTable("label", {
  id: integer().primaryKey({ autoIncrement: true }),
  label: text({ length: 255 }).notNull(),
});

export const media = sqliteTable("media", {
  id: integer().primaryKey({ autoIncrement: true }),
  floor: text({ length: 255 }).notNull(),
  sid: text({ length: 255 }).notNull(),
  content: text().notNull(),
});

export const nature = sqliteTable("nature", {
  id: integer().primaryKey({ autoIncrement: true }),
  nature: text({ length: 255 }).notNull(),
});

export const natureV2 = sqliteTable("nature_v2", {
  id: integer().primaryKey({ autoIncrement: true }),
  nature: text({ length: 255 }).notNull(),
  reutilisation: integer(),
  recyclable: integer(),
  valorisationMatiere: integer("valorisation_matiere"),
  valorisationEnergetique: integer("valorisation_energetique"),
  densite: real(),
  stockage: text({ length: 100 }),
  codeDechet: integer("code_dechet"),
  ecoOrganismeRep: text("eco_organisme_rep", { length: 255 }),
  incinerationSansValorisationEnergetique: integer("incineration_sans_valorisation_energetique"),
  nonValorisation: integer("non_valorisation"),
});

export const objets = sqliteTable("objets", {
  id: integer().primaryKey({ autoIncrement: true }),
  categorieId: integer("categorie_id").notNull().references(() => categorieV2.id),
  objet: text({ length: 255 }).notNull(),
  unite: text({ length: 100 }),
  deposeReemlpoi: text("depose_reemlpoi"),
  deposeDechet: text("depose_dechet"),
  masseUnitaire: text("masse_unitaire", { length: 255 }),
},
  (table) => [
    index("IDX_334ABAD9BCF5E72D").on(table.categorieId),
  ]);

export const operationProjet = sqliteTable("operation_projet", {
  id: integer().primaryKey({ autoIncrement: true }),
  projetId: text("projet_id", { length: 50 }).references(() => projet.id),
  type: text({ length: 255 }).notNull(),
  intervenant: text({ length: 255 }).notNull(),
  dateDeDebut: numeric("date_de_debut"),
  dateDeFin: numeric("date_de_fin"),
  observation: text(),
},
  (table) => [
    index("IDX_2D9525CBC18272").on(table.projetId),
  ]);

export const pemd = sqliteTable("pemd", {
  id: text({ length: 255 }).primaryKey().notNull(),
  natureId: integer("nature_id").notNull().references(() => natureV2.id),
  objetId: integer("objet_id").notNull().references(() => objets.id),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  description: text({ length: 255 }),
  quantite: real(),
  potentielReemploi: text("potentiel_reemploi", { length: 255 }),
  longueur: real(),
  largeur: real(),
  epaisseur: real(),
  volume: real(),
  reemploi: integer(),
  etage: text({ length: 255 }).notNull(),
  constitution: text({ length: 100 }),
  masse: real(),
  etat: text({ length: 100 }),
  anchorPosition: text("anchor_position", { length: 500 }).notNull(),
  stemVector: text("stem_vector", { length: 500 }).notNull(),
  color: text({ length: 255 }),
  image: text().notNull(),
  surface: real(),
  dimension: text({ length: 255 }).notNull(),
  amiante: integer(),
  plombifere: integer(),
  termite: integer(),
  typologieAppart: text("typologie_appart", { length: 255 }).notNull(),
  estimationAge: text("estimation_age", { length: 255 }),
  typeAssemblage: text("type_assemblage", { length: 255 }),
},
  (table) => [
    index("IDX_9EEBC6E0F520CF5A").on(table.objetId),
    index("IDX_9EEBC6E08512B786").on(table.sidId),
    index("IDX_9EEBC6E03BCB2E4B").on(table.natureId),
  ]);

export const projet = sqliteTable("projet", {
  id: text({ length: 50 }).primaryKey().notNull(),
  idEtablissementId: integer("id_etablissement_id").references(() => etablissement.id),
  idEtabId: integer("id_etab_id").notNull().references(() => etablissement.id),
  libelle: text({ length: 255 }).notNull(),
  reference: text({ length: 255 }).notNull(),
  codeInsee: integer("code_insee").notNull(),
  rue: text({ length: 255 }).notNull(),
  cp: integer().notNull(),
  ville: text({ length: 255 }).notNull(),
  dateDemarrage: numeric("date_demarrage").notNull(),
  section: text({ length: 10 }).notNull(),
  parcelle: text({ length: 10 }).notNull(),
  typeOperation: text("type_operation", { length: 255 }),
  maitreDOuvrage: text("maitre_d_ouvrage", { length: 255 }),
  dateDeFin: numeric("date_de_fin"),
},
  (table) => [
    index("IDX_50159CA9A6B127CC").on(table.idEtabId),
    index("IDX_50159CA91CE947F9").on(table.idEtablissementId),
  ]);

export const projetUser = sqliteTable("projet_user", {
  projetId: text("projet_id", { length: 50 }).notNull().references(() => projet.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => userLegacy.id, { onDelete: "cascade" }),
},
  (table) => [
    index("IDX_FA413966C18272").on(table.projetId),
    index("IDX_FA413966A76ED395").on(table.userId),
    primaryKey({ columns: [table.projetId, table.userId], name: "projet_user_projet_id_user_id_pk" })
  ]);

export const qrcode = sqliteTable("qrcode", {
  id: integer().primaryKey({ autoIncrement: true }),
  tagId: text("tag_id", { length: 255 }).notNull().references(() => pemd.id, { onDelete: "cascade" }),
  action: text().notNull(),
},
  (table) => [
    index("IDX_A4FF23ECBAD26311").on(table.tagId),
  ]);

export const societe = sqliteTable("societe", {
  id: integer().primaryKey({ autoIncrement: true }),
  nom: text({ length: 255 }).notNull(),
  raisonSocial: text("raison_social", { length: 255 }).notNull(),
  rue: text({ length: 255 }).notNull(),
  cp: text({ length: 5 }).notNull(),
  ville: text({ length: 255 }).notNull(),
  tel: text({ length: 15 }).notNull(),
  fax: text({ length: 15 }).notNull(),
  email: text({ length: 255 }).notNull(),
  siren: text({ length: 255 }),
  type: integer().notNull(),
});

export const sousCategorie = sqliteTable("sous_categorie", {
  id: integer().primaryKey({ autoIncrement: true }),
  categorieId: integer("categorie_id").notNull().references(() => categorieV2.id),
  sousCategorie: text("sous_categorie", { length: 255 }).notNull(),
},
  (table) => [
    index("IDX_52743D7BBCF5E72D").on(table.categorieId),
  ]);

export const structure = sqliteTable("structure", {
  id: integer().primaryKey({ autoIncrement: true }),
  objetId: integer("objet_id").notNull().references(() => objets.id),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  natureId: integer("nature_id").notNull().references(() => natureV2.id),
  reference: text({ length: 255 }).notNull(),
  description: text({ length: 255 }),
  reemploi: integer(),
  potentielReemploi: real("potentiel_reemploi"),
  epaisseur: real(),
  surface: real(),
  volume: real(),
  masse: real(),
  etage: text({ length: 255 }).notNull(),
  constitution: text({ length: 255 }).notNull(),
  etat: text({ length: 255 }),
  type: text({ length: 255 }).notNull(),
  amiante: integer(),
  plomb: integer(),
  couche: text({ length: 255 }).notNull(),
  quantite: integer(),
},
  (table) => [
    index("IDX_6F0137EAF520CF5A").on(table.objetId),
    index("IDX_6F0137EA8512B786").on(table.sidId),
    index("IDX_6F0137EA3BCB2E4B").on(table.natureId),
  ]);

export const tagMail = sqliteTable("tag_mail", {
  id: text({ length: 255 }).primaryKey().notNull(),
  projetIdId: text("projet_id_id", { length: 50 }).notNull().references(() => projet.id),
  userIdId: integer("user_id_id").notNull().references(() => userLegacy.id),
  date: numeric().notNull(),
  content: text().notNull(),
  stemVector: text("stem_vector", { length: 1000 }).notNull(),
  anchorPosition: text("anchor_position", { length: 1000 }).notNull(),
  destinataires: text({ length: 300 }).notNull(),
},
  (table) => [
    index("IDX_BF2913FED4E271E1").on(table.projetIdId),
    index("IDX_BF2913FE9D86650F").on(table.userIdId),
  ]);

export const tags = sqliteTable("tags", {
  id: text({ length: 255 }).primaryKey().notNull(),
  projetIdId: text("projet_id_id", { length: 50 }).references(() => projet.id),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  label: text({ length: 100 }).notNull(),
  description: text({ length: 255 }).notNull(),
  anchorPosition: text("anchor_position", { length: 300 }).notNull(),
  stemVector: text("stem_vector", { length: 300 }).notNull(),
  color: text({ length: 255 }).notNull(),
  image: text().notNull(),
},
  (table) => [
    index("IDX_6FBC9426D4E271E1").on(table.projetIdId),
    index("IDX_6FBC94268512B786").on(table.sidId),
  ]);

export const tagsAmiante = sqliteTable("tags_amiante", {
  id: text({ length: 50 }).primaryKey().notNull(),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  label: text({ length: 255 }).notNull(),
  description: text({ length: 255 }).notNull(),
  anchorPosition: text("anchor_position", { length: 300 }).notNull(),
  stemVector: text("stem_vector", { length: 255 }).notNull(),
  image: text().notNull(),
  presenceAmiante: integer("presence_amiante").notNull(),
  type: text({ length: 255 }).notNull(),
  brusharray: text(),
  customImage: text("custom_image").notNull(),
  etage: text({ length: 100 }).notNull(),
},
  (table) => [
    index("IDX_10125EF8512B786").on(table.sidId),
  ]);

export const tagsPlomb = sqliteTable("tags_plomb", {
  id: text({ length: 50 }).primaryKey().notNull(),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  label: text({ length: 255 }).notNull(),
  description: text({ length: 500 }).notNull(),
  anchorPosition: text("anchor_position", { length: 500 }).notNull(),
  stemVector: text("stem_vector", { length: 500 }).notNull(),
  image: text().notNull(),
  presencePlomb: integer("presence_plomb").notNull(),
  concentration: integer(),
  brusharray: text(),
  customImage: text("custom_image").notNull(),
  etage: text({ length: 100 }).notNull(),
},
  (table) => [
    index("IDX_150030B28512B786").on(table.sidId),
  ]);

export const tagsStructure = sqliteTable("tags_structure", {
  id: text({ length: 50 }).primaryKey().notNull(),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  label: text({ length: 255 }).notNull(),
  description: text({ length: 500 }).notNull(),
  anchorPosition: text("anchor_position", { length: 500 }).notNull(),
  stemVector: text("stem_vector", { length: 500 }).notNull(),
  image: text().notNull(),
  brusharray: text(),
  customImage: text("custom_image").notNull(),
  screenSurface: text("screen_surface"),
  shapeSurface: real("shape_surface"),
},
  (table) => [
    index("IDX_B0009B68512B786").on(table.sidId),
  ]);

export const tagsTermite = sqliteTable("tags_termite", {
  id: text({ length: 50 }).primaryKey().notNull(),
  sidId: text("sid_id", { length: 50 }).notNull().references(() => projet.id),
  label: text({ length: 255 }).notNull(),
  description: text({ length: 500 }).notNull(),
  anchorPosition: text("anchor_position", { length: 500 }).notNull(),
  stemVector: text("stem_vector", { length: 500 }).notNull(),
  image: text().notNull(),
  presenceTermite: integer("presence_termite").notNull(),
  brusharray: text(),
  customImage: text("custom_image").notNull(),
  etage: text({ length: 100 }).notNull(),
},
  (table) => [
    index("IDX_801D1B458512B786").on(table.sidId),
  ]);

export const userLegacy = sqliteTable("user_legacy", {
  id: integer().primaryKey({ autoIncrement: true }),
  idEtabId: integer("id_etab_id").notNull().references(() => etablissement.id),
  email: text({ length: 180 }).notNull(),
  roles: text().notNull(),
  password: text({ length: 255 }).notNull(),
  nom: text({ length: 255 }).notNull(),
  prenom: text({ length: 255 }),
  rue: text({ length: 255 }),
  cp: text({ length: 255 }),
  ville: text({ length: 255 }),
  tel: text({ length: 255 }),
},
  (table) => [
    uniqueIndex("UNIQ_8D93D649E7927C74").on(table.email),
    index("IDX_8D93D649A6B127CC").on(table.idEtabId),
  ]);
