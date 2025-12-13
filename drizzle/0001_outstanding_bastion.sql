CREATE TABLE `categorie_v2` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`groupe_id` integer NOT NULL,
	`categoriev2` text(255) NOT NULL,
	FOREIGN KEY (`groupe_id`) REFERENCES `groupe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_F3A71D727A45358C` ON `categorie_v2` (`groupe_id`);--> statement-breakpoint
CREATE TABLE `cerfa_diagnostic` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`derniere_visite` numeric,
	`bat_non_visite` text,
	`raisons_ne_pas_visite` text,
	`desordres` integer,
	`precaution` integer,
	`document_consultés` text,
	`bat_visite` text,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_69DB1259C18272` ON `cerfa_diagnostic` (`projet_id`);--> statement-breakpoint
CREATE TABLE `cerfa_diagnostiqueur` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`nom_per_phy` text(255),
	`prenom_per_phy` text(255),
	`nom_per_morale` text(255),
	`siret_siren` text(255),
	`adresse` text(255),
	`cp` text(255),
	`commune` text(255),
	`engagement_assurance` integer,
	`nom_assurance` text(255),
	`numero_police` text(255),
	`date_debut_assurance` numeric,
	`date_fin_assurance` numeric,
	`competences` integer,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_3ADF2D26C18272` ON `cerfa_diagnostiqueur` (`projet_id`);--> statement-breakpoint
CREATE TABLE `cerfa_mtr_ouvrage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`nom_per_phy` text(255),
	`prenom_per_phy` text(255),
	`nom_per_morale` text(255),
	`siret_siren` text(255),
	`adresse` text(255),
	`cp` real,
	`commune` text(255),
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_14B224E0C18272` ON `cerfa_mtr_ouvrage` (`projet_id`);--> statement-breakpoint
CREATE TABLE `cerfa_operation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`adresse` text(500),
	`cp` text(255),
	`commune` text(255),
	`date_de_debut` numeric,
	`date_de_fin` numeric,
	`operation` text,
	`nb_bat_demolition` real,
	`surface_a_demolir` real,
	`nb_bat_renovation` real,
	`surface_a_renover` real,
	`typologie_bat` text,
	`date_permis_de_construire` numeric,
	`operation_soumis` text,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_B7E4EBE0C18272` ON `cerfa_operation` (`projet_id`);--> statement-breakpoint
CREATE TABLE `dechets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dechet` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `doctrine_migration_versions` (
	`version` text(191) PRIMARY KEY NOT NULL,
	`executed_at` numeric,
	`execution_time` integer
);
--> statement-breakpoint
CREATE TABLE `etablissement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_societe_id` integer NOT NULL,
	`nom` text(255) NOT NULL,
	`raison_social` text(50) NOT NULL,
	`rue` text(255) NOT NULL,
	`cp` text(5) NOT NULL,
	`ville` text(255) NOT NULL,
	`tel` text(255) NOT NULL,
	`fax` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`siret` text(255) NOT NULL,
	FOREIGN KEY (`id_societe_id`) REFERENCES `societe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_20FD592C597DF5D4` ON `etablissement` (`id_societe_id`);--> statement-breakpoint
CREATE TABLE `extrapolation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sid_id` text(50) NOT NULL,
	`extrapolation_data` text NOT NULL,
	`constitution` text(10000),
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_284FF9E58512B786` ON `extrapolation` (`sid_id`);--> statement-breakpoint
CREATE TABLE `groupe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`groupe` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `label` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`floor` text(255) NOT NULL,
	`sid` text(255) NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nature` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nature` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nature_v2` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nature` text(255) NOT NULL,
	`reutilisation` integer,
	`recyclable` integer,
	`valorisation_matiere` integer,
	`valorisation_energetique` integer,
	`densite` real,
	`stockage` text(100),
	`code_dechet` integer,
	`eco_organisme_rep` text(255),
	`incineration_sans_valorisation_energetique` integer,
	`non_valorisation` integer
);
--> statement-breakpoint
CREATE TABLE `objets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categorie_id` integer NOT NULL,
	`objet` text(255) NOT NULL,
	`unite` text(100),
	`depose_reemlpoi` text,
	`depose_dechet` text,
	`masse_unitaire` text(255),
	FOREIGN KEY (`categorie_id`) REFERENCES `categorie_v2`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_334ABAD9BCF5E72D` ON `objets` (`categorie_id`);--> statement-breakpoint
CREATE TABLE `operation_projet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`type` text(255) NOT NULL,
	`intervenant` text(255) NOT NULL,
	`date_de_debut` numeric,
	`date_de_fin` numeric,
	`observation` text,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_2D9525CBC18272` ON `operation_projet` (`projet_id`);--> statement-breakpoint
CREATE TABLE `pemd` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`nature_id` integer NOT NULL,
	`objet_id` integer NOT NULL,
	`sid_id` text(50) NOT NULL,
	`description` text(255),
	`quantite` real,
	`potentiel_reemploi` text(255),
	`longueur` real,
	`largeur` real,
	`epaisseur` real,
	`volume` real,
	`reemploi` integer,
	`etage` text(255) NOT NULL,
	`constitution` text(100),
	`masse` real,
	`etat` text(100),
	`anchor_position` text(500) NOT NULL,
	`stem_vector` text(500) NOT NULL,
	`color` text(255),
	`image` text NOT NULL,
	`surface` real,
	`dimension` text(255) NOT NULL,
	`amiante` integer,
	`plombifere` integer,
	`termite` integer,
	`typologie_appart` text(255) NOT NULL,
	`estimation_age` text(255),
	`type_assemblage` text(255),
	FOREIGN KEY (`nature_id`) REFERENCES `nature_v2`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`objet_id`) REFERENCES `objets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_9EEBC6E0F520CF5A` ON `pemd` (`objet_id`);--> statement-breakpoint
CREATE INDEX `IDX_9EEBC6E08512B786` ON `pemd` (`sid_id`);--> statement-breakpoint
CREATE INDEX `IDX_9EEBC6E03BCB2E4B` ON `pemd` (`nature_id`);--> statement-breakpoint
CREATE TABLE `projet` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`id_etablissement_id` integer,
	`id_etab_id` integer NOT NULL,
	`libelle` text(255) NOT NULL,
	`reference` text(255) NOT NULL,
	`code_insee` integer NOT NULL,
	`rue` text(255) NOT NULL,
	`cp` integer NOT NULL,
	`ville` text(255) NOT NULL,
	`date_demarrage` numeric NOT NULL,
	`section` text(10) NOT NULL,
	`parcelle` text(10) NOT NULL,
	`type_operation` text(255),
	`maitre_d_ouvrage` text(255),
	`date_de_fin` numeric,
	FOREIGN KEY (`id_etablissement_id`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_etab_id`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_50159CA9A6B127CC` ON `projet` (`id_etab_id`);--> statement-breakpoint
CREATE INDEX `IDX_50159CA91CE947F9` ON `projet` (`id_etablissement_id`);--> statement-breakpoint
CREATE TABLE `projet_user` (
	`projet_id` text(50) NOT NULL,
	`user_id` integer NOT NULL,
	PRIMARY KEY(`projet_id`, `user_id`),
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user_legacy`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `IDX_FA413966C18272` ON `projet_user` (`projet_id`);--> statement-breakpoint
CREATE INDEX `IDX_FA413966A76ED395` ON `projet_user` (`user_id`);--> statement-breakpoint
CREATE TABLE `qrcode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tag_id` text(255) NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `pemd`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `IDX_A4FF23ECBAD26311` ON `qrcode` (`tag_id`);--> statement-breakpoint
CREATE TABLE `societe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(255) NOT NULL,
	`raison_social` text(255) NOT NULL,
	`rue` text(255) NOT NULL,
	`cp` text(5) NOT NULL,
	`ville` text(255) NOT NULL,
	`tel` text(15) NOT NULL,
	`fax` text(15) NOT NULL,
	`email` text(255) NOT NULL,
	`siren` text(255),
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sous_categorie` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categorie_id` integer NOT NULL,
	`sous_categorie` text(255) NOT NULL,
	FOREIGN KEY (`categorie_id`) REFERENCES `categorie_v2`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_52743D7BBCF5E72D` ON `sous_categorie` (`categorie_id`);--> statement-breakpoint
CREATE TABLE `structure` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`objet_id` integer NOT NULL,
	`sid_id` text(50) NOT NULL,
	`nature_id` integer NOT NULL,
	`reference` text(255) NOT NULL,
	`description` text(255),
	`reemploi` integer,
	`potentiel_reemploi` real,
	`epaisseur` real,
	`surface` real,
	`volume` real,
	`masse` real,
	`etage` text(255) NOT NULL,
	`constitution` text(255) NOT NULL,
	`etat` text(255),
	`type` text(255) NOT NULL,
	`amiante` integer,
	`plomb` integer,
	`couche` text(255) NOT NULL,
	`quantite` integer,
	FOREIGN KEY (`objet_id`) REFERENCES `objets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nature_id`) REFERENCES `nature_v2`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_6F0137EAF520CF5A` ON `structure` (`objet_id`);--> statement-breakpoint
CREATE INDEX `IDX_6F0137EA8512B786` ON `structure` (`sid_id`);--> statement-breakpoint
CREATE INDEX `IDX_6F0137EA3BCB2E4B` ON `structure` (`nature_id`);--> statement-breakpoint
CREATE TABLE `tag_mail` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`projet_id_id` text(50) NOT NULL,
	`user_id_id` integer NOT NULL,
	`date` numeric NOT NULL,
	`content` text NOT NULL,
	`stem_vector` text(1000) NOT NULL,
	`anchor_position` text(1000) NOT NULL,
	`destinataires` text(300) NOT NULL,
	FOREIGN KEY (`projet_id_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id_id`) REFERENCES `user_legacy`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_BF2913FED4E271E1` ON `tag_mail` (`projet_id_id`);--> statement-breakpoint
CREATE INDEX `IDX_BF2913FE9D86650F` ON `tag_mail` (`user_id_id`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`projet_id_id` text(50),
	`sid_id` text(50) NOT NULL,
	`label` text(100) NOT NULL,
	`description` text(255) NOT NULL,
	`anchor_position` text(300) NOT NULL,
	`stem_vector` text(300) NOT NULL,
	`color` text(255) NOT NULL,
	`image` text NOT NULL,
	FOREIGN KEY (`projet_id_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_6FBC9426D4E271E1` ON `tags` (`projet_id_id`);--> statement-breakpoint
CREATE INDEX `IDX_6FBC94268512B786` ON `tags` (`sid_id`);--> statement-breakpoint
CREATE TABLE `tags_amiante` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`sid_id` text(50) NOT NULL,
	`label` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`anchor_position` text(300) NOT NULL,
	`stem_vector` text(255) NOT NULL,
	`image` text NOT NULL,
	`presence_amiante` integer NOT NULL,
	`type` text(255) NOT NULL,
	`brusharray` text,
	`custom_image` text NOT NULL,
	`etage` text(100) NOT NULL,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_10125EF8512B786` ON `tags_amiante` (`sid_id`);--> statement-breakpoint
CREATE TABLE `tags_plomb` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`sid_id` text(50) NOT NULL,
	`label` text(255) NOT NULL,
	`description` text(500) NOT NULL,
	`anchor_position` text(500) NOT NULL,
	`stem_vector` text(500) NOT NULL,
	`image` text NOT NULL,
	`presence_plomb` integer NOT NULL,
	`concentration` integer,
	`brusharray` text,
	`custom_image` text NOT NULL,
	`etage` text(100) NOT NULL,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_150030B28512B786` ON `tags_plomb` (`sid_id`);--> statement-breakpoint
CREATE TABLE `tags_structure` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`sid_id` text(50) NOT NULL,
	`label` text(255) NOT NULL,
	`description` text(500) NOT NULL,
	`anchor_position` text(500) NOT NULL,
	`stem_vector` text(500) NOT NULL,
	`image` text NOT NULL,
	`brusharray` text,
	`custom_image` text NOT NULL,
	`screen_surface` text,
	`shape_surface` real,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_B0009B68512B786` ON `tags_structure` (`sid_id`);--> statement-breakpoint
CREATE TABLE `tags_termite` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`sid_id` text(50) NOT NULL,
	`label` text(255) NOT NULL,
	`description` text(500) NOT NULL,
	`anchor_position` text(500) NOT NULL,
	`stem_vector` text(500) NOT NULL,
	`image` text NOT NULL,
	`presence_termite` integer NOT NULL,
	`brusharray` text,
	`custom_image` text NOT NULL,
	`etage` text(100) NOT NULL,
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `IDX_801D1B458512B786` ON `tags_termite` (`sid_id`);--> statement-breakpoint
CREATE TABLE `user_legacy` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_etab_id` integer NOT NULL,
	`email` text(180) NOT NULL,
	`roles` text NOT NULL,
	`password` text(255) NOT NULL,
	`nom` text(255) NOT NULL,
	`prenom` text(255),
	`rue` text(255),
	`cp` text(255),
	`ville` text(255),
	`tel` text(255),
	FOREIGN KEY (`id_etab_id`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UNIQ_8D93D649E7927C74` ON `user_legacy` (`email`);--> statement-breakpoint
CREATE INDEX `IDX_8D93D649A6B127CC` ON `user_legacy` (`id_etab_id`);