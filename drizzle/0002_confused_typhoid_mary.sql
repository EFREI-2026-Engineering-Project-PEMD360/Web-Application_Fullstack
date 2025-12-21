PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cerfa_diagnostic` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`derniere_visite` integer,
	`bat_non_visite` text,
	`raisons_ne_pas_visite` text,
	`desordres` integer,
	`precaution` integer,
	`document_consultés` text,
	`bat_visite` text,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_cerfa_diagnostic`("id", "projet_id", "derniere_visite", "bat_non_visite", "raisons_ne_pas_visite", "desordres", "precaution", "document_consultés", "bat_visite") SELECT "id", "projet_id", "derniere_visite", "bat_non_visite", "raisons_ne_pas_visite", "desordres", "precaution", "document_consultés", "bat_visite" FROM `cerfa_diagnostic`;--> statement-breakpoint
DROP TABLE `cerfa_diagnostic`;--> statement-breakpoint
ALTER TABLE `__new_cerfa_diagnostic` RENAME TO `cerfa_diagnostic`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_cerfa_diagnostiqueur` (
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
	`date_debut_assurance` integer,
	`date_fin_assurance` integer,
	`competences` integer,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_cerfa_diagnostiqueur`("id", "projet_id", "nom_per_phy", "prenom_per_phy", "nom_per_morale", "siret_siren", "adresse", "cp", "commune", "engagement_assurance", "nom_assurance", "numero_police", "date_debut_assurance", "date_fin_assurance", "competences") SELECT "id", "projet_id", "nom_per_phy", "prenom_per_phy", "nom_per_morale", "siret_siren", "adresse", "cp", "commune", "engagement_assurance", "nom_assurance", "numero_police", "date_debut_assurance", "date_fin_assurance", "competences" FROM `cerfa_diagnostiqueur`;--> statement-breakpoint
DROP TABLE `cerfa_diagnostiqueur`;--> statement-breakpoint
ALTER TABLE `__new_cerfa_diagnostiqueur` RENAME TO `cerfa_diagnostiqueur`;--> statement-breakpoint
CREATE TABLE `__new_cerfa_operation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projet_id` text(50),
	`adresse` text(500),
	`cp` text(255),
	`commune` text(255),
	`date_de_debut` integer,
	`date_de_fin` integer,
	`operation` text,
	`nb_bat_demolition` real,
	`surface_a_demolir` real,
	`nb_bat_renovation` real,
	`surface_a_renover` real,
	`typologie_bat` text,
	`date_permis_de_construire` integer,
	`operation_soumis` text,
	FOREIGN KEY (`projet_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_cerfa_operation`("id", "projet_id", "adresse", "cp", "commune", "date_de_debut", "date_de_fin", "operation", "nb_bat_demolition", "surface_a_demolir", "nb_bat_renovation", "surface_a_renover", "typologie_bat", "date_permis_de_construire", "operation_soumis") SELECT "id", "projet_id", "adresse", "cp", "commune", "date_de_debut", "date_de_fin", "operation", "nb_bat_demolition", "surface_a_demolir", "nb_bat_renovation", "surface_a_renover", "typologie_bat", "date_permis_de_construire", "operation_soumis" FROM `cerfa_operation`;--> statement-breakpoint
DROP TABLE `cerfa_operation`;--> statement-breakpoint
ALTER TABLE `__new_cerfa_operation` RENAME TO `cerfa_operation`;--> statement-breakpoint
CREATE TABLE `__new_doctrine_migration_versions` (
	`version` text(191) PRIMARY KEY NOT NULL,
	`executed_at` integer,
	`execution_time` integer
);
--> statement-breakpoint
INSERT INTO `__new_doctrine_migration_versions`("version", "executed_at", "execution_time") SELECT "version", "executed_at", "execution_time" FROM `doctrine_migration_versions`;--> statement-breakpoint
DROP TABLE `doctrine_migration_versions`;--> statement-breakpoint
ALTER TABLE `__new_doctrine_migration_versions` RENAME TO `doctrine_migration_versions`;--> statement-breakpoint
CREATE TABLE `__new_projet` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`id_etablissement_id` integer,
	`id_etab_id` integer NOT NULL,
	`libelle` text(255) NOT NULL,
	`reference` text(255) NOT NULL,
	`code_insee` integer NOT NULL,
	`rue` text(255) NOT NULL,
	`cp` integer NOT NULL,
	`ville` text(255) NOT NULL,
	`date_demarrage` integer NOT NULL,
	`section` text(10) NOT NULL,
	`parcelle` text(10) NOT NULL,
	`type_operation` text(255),
	`maitre_d_ouvrage` text(255),
	`date_de_fin` integer,
	FOREIGN KEY (`id_etablissement_id`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_etab_id`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projet`("id", "id_etablissement_id", "id_etab_id", "libelle", "reference", "code_insee", "rue", "cp", "ville", "date_demarrage", "section", "parcelle", "type_operation", "maitre_d_ouvrage", "date_de_fin") SELECT "id", "id_etablissement_id", "id_etab_id", "libelle", "reference", "code_insee", "rue", "cp", "ville", "date_demarrage", "section", "parcelle", "type_operation", "maitre_d_ouvrage", "date_de_fin" FROM `projet`;--> statement-breakpoint
DROP TABLE `projet`;--> statement-breakpoint
ALTER TABLE `__new_projet` RENAME TO `projet`;--> statement-breakpoint
CREATE TABLE `__new_tag_mail` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`projet_id_id` text(50) NOT NULL,
	`user_id_id` integer NOT NULL,
	`date` integer NOT NULL,
	`content` text NOT NULL,
	`stem_vector` text(1000) NOT NULL,
	`anchor_position` text(1000) NOT NULL,
	`destinataires` text(300) NOT NULL,
	FOREIGN KEY (`projet_id_id`) REFERENCES `projet`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id_id`) REFERENCES `user_legacy`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tag_mail`("id", "projet_id_id", "user_id_id", "date", "content", "stem_vector", "anchor_position", "destinataires") SELECT "id", "projet_id_id", "user_id_id", "date", "content", "stem_vector", "anchor_position", "destinataires" FROM `tag_mail`;--> statement-breakpoint
DROP TABLE `tag_mail`;--> statement-breakpoint
ALTER TABLE `__new_tag_mail` RENAME TO `tag_mail`;