import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, real, numeric, primaryKey } from "drizzle-orm/sqlite-core";

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



// --- Migrations & Système ---

export const doctrineMigrationVersions = sqliteTable('doctrine_migration_versions', {
  version: text('version', { length: 191 }).primaryKey(),
  executedAt: numeric('executed_at'),
  executionTime: integer('execution_time'),
});

// --- Données de base ---

export const groupe = sqliteTable('groupe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupe: text('groupe', { length: 255 }).notNull(),
});

export const categorieV2 = sqliteTable('categorie_v2', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupeId: integer('groupe_id')
    .notNull()
    .references(() => groupe.id),
  categoriev2: text('categoriev2', { length: 255 }).notNull(),
});

export const natureV2 = sqliteTable('nature_v2', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nature: text('nature', { length: 255 }).notNull(),
  reutilisation: integer('reutilisation'),
  recyclable: integer('recyclable'),
  valorisationMatiere: integer('valorisation_matiere'),
  valorisationEnergetique: integer('valorisation_energetique'),
  densite: real('densite'),
  stockage: text('stockage', { length: 100 }),
  codeDechet: integer('code_dechet'),
  ecoOrganismeRep: text('eco_organisme_rep', { length: 255 }),
  incinerationSansValorisationEnergetique: integer('incineration_sans_valorisation_energetique'),
  nonValorisation: integer('non_valorisation'),
});

export const objets = sqliteTable('objets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categorieId: integer('categorie_id')
    .notNull()
    .references(() => categorieV2.id),
  objet: text('objet', { length: 255 }).notNull(),
  unite: text('unite', { length: 100 }),
  deposeReemlpoi: text('depose_reemlpoi'),
  deposeDechet: text('depose_dechet'),
  masseUnitaire: text('masse_unitaire', { length: 255 }),
});

// --- Sociétés & Établissements ---

export const societe = sqliteTable('societe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom', { length: 255 }).notNull(),
  raisonSocial: text('raison_social', { length: 255 }).notNull(),
  rue: text('rue', { length: 255 }).notNull(),
  cp: text('cp', { length: 5 }).notNull(),
  ville: text('ville', { length: 255 }).notNull(),
  tel: text('tel', { length: 15 }).notNull(),
  fax: text('fax', { length: 15 }).notNull(),
  email: text('email', { length: 255 }).notNull(),
  siren: text('siren', { length: 255 }),
  type: integer('type').notNull(),
});

export const etablissement = sqliteTable('etablissement', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  idSocieteId: integer('id_societe_id')
    .notNull()
    .references(() => societe.id),
  nom: text('nom', { length: 255 }).notNull(),
  raisonSocial: text('raison_social', { length: 50 }).notNull(),
  rue: text('rue', { length: 255 }).notNull(),
  cp: text('cp', { length: 5 }).notNull(),
  ville: text('ville', { length: 255 }).notNull(),
  tel: text('tel', { length: 255 }).notNull(),
  fax: text('fax', { length: 255 }).notNull(),
  email: text('email', { length: 255 }).notNull(),
  siret: text('siret', { length: 255 }).notNull(),
});

// --- Projets & Diagnostics ---

export const projet = sqliteTable('projet', {
  id: text('id', { length: 50 }).primaryKey(),
  idEtablissementId: integer('id_etablissement_id').references(() => etablissement.id),
  idEtabId: integer('id_etab_id')
    .notNull()
    .references(() => etablissement.id),
  libelle: text('libelle', { length: 255 }).notNull(),
  reference: text('reference', { length: 255 }).notNull(),
  codeInsee: integer('code_insee').notNull(),
  rue: text('rue', { length: 255 }).notNull(),
  cp: integer('cp').notNull(),
  ville: text('ville', { length: 255 }).notNull(),
  dateDemarrage: numeric('date_demarrage').notNull(),
  section: text('section', { length: 10 }).notNull(),
  parcelle: text('parcelle', { length: 10 }).notNull(),
  typeOperation: text('type_operation', { length: 255 }),
  maitreDOuvrage: text('maitre_d_ouvrage', { length: 255 }),
  dateDeFin: numeric('date_de_fin'),
});

export const cerfaDiagnostic = sqliteTable('cerfa_diagnostic', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projetId: text('projet_id', { length: 50 }).references(() => projet.id),
  derniereVisite: numeric('derniere_visite'),
  batNonVisite: text('bat_non_visite'),
  raisonsNePasVisite: text('raisons_ne_pas_visite'),
  desordres: integer('desordres'),
  precaution: integer('precaution'),
  documentConsultes: text('document_consultés'),
  batVisite: text('bat_visite'),
});

export const cerfaDiagnostiqueur = sqliteTable('cerfa_diagnostiqueur', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projetId: text('projet_id', { length: 50 }).references(() => projet.id),
  nomPerPhy: text('nom_per_phy', { length: 255 }),
  prenomPerPhy: text('prenom_per_phy', { length: 255 }),
  nomPerMorale: text('nom_per_morale', { length: 255 }),
  siretSiren: text('siret_siren', { length: 255 }),
  adresse: text('adresse', { length: 255 }),
  cp: text('cp', { length: 255 }),
  commune: text('commune', { length: 255 }),
  engagementAssurance: integer('engagement_assurance'),
  nomAssurance: text('nom_assurance', { length: 255 }),
  numeroPolice: text('numero_police', { length: 255 }),
  dateDebutAssurance: numeric('date_debut_assurance'),
  dateFinAssurance: numeric('date_fin_assurance'),
  competences: integer('competences'),
});

export const cerfaMtrOuvrage = sqliteTable('cerfa_mtr_ouvrage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projetId: text('projet_id', { length: 50 }).references(() => projet.id),
  nomPerPhy: text('nom_per_phy', { length: 255 }),
  prenomPerPhy: text('prenom_per_phy', { length: 255 }),
  nomPerMorale: text('nom_per_morale', { length: 255 }),
  siretSiren: text('siret_siren', { length: 255 }),
  adresse: text('adresse', { length: 255 }),
  cp: real('cp'),
  commune: text('commune', { length: 255 }),
});

export const cerfaOperation = sqliteTable('cerfa_operation', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projetId: text('projet_id', { length: 50 }).references(() => projet.id),
  adresse: text('adresse', { length: 500 }),
  cp: text('cp', { length: 255 }),
  commune: text('commune', { length: 255 }),
  dateDeDebut: numeric('date_de_debut'),
  dateDeFin: numeric('date_de_fin'),
  operation: text('operation'),
  nbBatDemolition: real('nb_bat_demolition'),
  surfaceADemolir: real('surface_a_demolir'),
  nbBatRenovation: real('nb_bat_renovation'),
  surfaceARenover: real('surface_a_renover'),
  typologieBat: text('typologie_bat'),
  datePermisDeConstruire: numeric('date_permis_de_construire'),
  operationSoumis: text('operation_soumis'),
});

export const extrapolation = sqliteTable('extrapolation', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sidId: text('sid_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  extrapolationData: text('extrapolation_data').notNull(),
  constitution: text('constitution', { length: 10000 }),
});

// --- Tags & Analyse ---

export const tagsAmiante = sqliteTable('tags_amiante', {
  id: text('id', { length: 50 }).primaryKey(),
  sidId: text('sid_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  label: text('label', { length: 255 }).notNull(),
  description: text('description', { length: 255 }).notNull(),
  anchorPosition: text('anchor_position', { length: 300 }).notNull(),
  stemVector: text('stem_vector', { length: 255 }).notNull(),
  image: text('image').notNull(),
  presenceAmiante: integer('presence_amiante').notNull(),
  type: text('type', { length: 255 }).notNull(),
  brusharray: text('brusharray'),
  customImage: text('custom_image').notNull(),
  etage: text('etage', { length: 100 }).notNull(),
});

export const tagsPlomb = sqliteTable('tags_plomb', {
  id: text('id', { length: 50 }).primaryKey(),
  sidId: text('sid_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  label: text('label', { length: 255 }).notNull(),
  description: text('description', { length: 500 }).notNull(),
  anchorPosition: text('anchor_position', { length: 500 }).notNull(),
  stemVector: text('stem_vector', { length: 500 }).notNull(),
  image: text('image').notNull(),
  presencePlomb: integer('presence_plomb').notNull(),
  concentration: integer('concentration'),
  brusharray: text('brusharray'),
  customImage: text('custom_image').notNull(),
  etage: text('etage', { length: 100 }).notNull(),
});

export const tagsStructure = sqliteTable('tags_structure', {
  id: text('id', { length: 50 }).primaryKey(),
  sidId: text('sid_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  label: text('label', { length: 255 }).notNull(),
  description: text('description', { length: 500 }).notNull(),
  anchorPosition: text('anchor_position', { length: 500 }).notNull(),
  stemVector: text('stem_vector', { length: 500 }).notNull(),
  image: text('image').notNull(),
  brusharray: text('brusharray'),
  customImage: text('custom_image').notNull(),
  screenSurface: text('screen_surface'),
  shapeSurface: real('shape_surface'),
});

export const tagsTermite = sqliteTable('tags_termite', {
  id: text('id', { length: 50 }).primaryKey(),
  sidId: text('sid_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  label: text('label', { length: 255 }).notNull(),
  description: text('description', { length: 500 }).notNull(),
  anchorPosition: text('anchor_position', { length: 500 }).notNull(),
  stemVector: text('stem_vector', { length: 500 }).notNull(),
  image: text('image').notNull(),
  presenceTermite: integer('presence_termite').notNull(),
  brusharray: text('brusharray'),
  customImage: text('custom_image').notNull(),
  etage: text('etage', { length: 100 }).notNull(),
});

// --- Utilisateurs & Relations ---

export const userLegacy = sqliteTable('user_legacy', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  idEtabId: integer('id_etab_id')
    .notNull()
    .references(() => etablissement.id),
  email: text('email', { length: 180 }).notNull(),
  roles: text('roles').notNull(),
  password: text('password', { length: 255 }).notNull(),
  nom: text('nom', { length: 255 }).notNull(),
  prenom: text('prenom', { length: 255 }),
  rue: text('rue', { length: 255 }),
  cp: text('cp', { length: 255 }),
  ville: text('ville', { length: 255 }),
  tel: text('tel', { length: 255 }),
});

export const projetUser = sqliteTable(
  'projet_user',
  {
    projetId: text('projet_id', { length: 50 })
      .notNull()
      .references(() => projet.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => userLegacy.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projetId, table.userId] }),
  })
);

export const tagMail = sqliteTable('tag_mail', {
  id: text('id', { length: 255 }).primaryKey(),
  projetIdId: text('projet_id_id', { length: 50 })
    .notNull()
    .references(() => projet.id),
  userIdId: integer('user_id_id')
    .notNull()
    .references(() => userLegacy.id),
  date: numeric('date').notNull(),
  content: text('content').notNull(),
  stemVector: text('stem_vector', { length: 1000 }).notNull(),
  anchorPosition: text('anchor_position', { length: 1000 }).notNull(),
  destinataires: text('destinataires', { length: 300 }).notNull(),
});
