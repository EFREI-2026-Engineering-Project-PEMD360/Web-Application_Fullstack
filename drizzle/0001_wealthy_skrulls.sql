CREATE TABLE `categorie_v2` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`groupe_id` integer NOT NULL,
	`categoriev2` text(255) NOT NULL,
	FOREIGN KEY (`groupe_id`) REFERENCES `groupe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
CREATE TABLE `extrapolation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sid_id` text(50) NOT NULL,
	`extrapolation_data` text NOT NULL,
	`constitution` text(10000),
	FOREIGN KEY (`sid_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `groupe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`groupe` text(255) NOT NULL
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
CREATE TABLE `projet_user` (
	`projet_id` text(50) NOT NULL,
	`user_id` integer NOT NULL,
	PRIMARY KEY(`projet_id`, `user_id`),
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user_legacy`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
