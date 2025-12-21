PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projet` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`id_etablissement_id` integer,
	`id_etab_id` integer NOT NULL,
	`libelle` text(255) NOT NULL,
	`reference` text(255) NOT NULL,
	`code_insee` text(5) NOT NULL,
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `projet_id_etablissement_id_idx` ON `projet` (`id_etablissement_id`);--> statement-breakpoint
CREATE INDEX `projet_id_etab_id_idx` ON `projet` (`id_etab_id`);--> statement-breakpoint
CREATE INDEX `categorie_v2_groupe_id_idx` ON `categorie_v2` (`groupe_id`);--> statement-breakpoint
CREATE INDEX `cerfa_diagnostic_projet_id_idx` ON `cerfa_diagnostic` (`projet_id`);--> statement-breakpoint
CREATE INDEX `cerfa_diagnostiqueur_projet_id_idx` ON `cerfa_diagnostiqueur` (`projet_id`);--> statement-breakpoint
CREATE INDEX `cerfa_mtr_ouvrage_projet_id_idx` ON `cerfa_mtr_ouvrage` (`projet_id`);--> statement-breakpoint
CREATE INDEX `cerfa_operation_projet_id_idx` ON `cerfa_operation` (`projet_id`);--> statement-breakpoint
CREATE INDEX `etablissement_id_societe_id_idx` ON `etablissement` (`id_societe_id`);--> statement-breakpoint
CREATE INDEX `extrapolation_sid_id_idx` ON `extrapolation` (`sid_id`);--> statement-breakpoint
CREATE INDEX `objets_categorie_id_idx` ON `objets` (`categorie_id`);--> statement-breakpoint
CREATE INDEX `projet_user_user_id_idx` ON `projet_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `tag_mail_projet_id_id_idx` ON `tag_mail` (`projet_id_id`);--> statement-breakpoint
CREATE INDEX `tag_mail_user_id_id_idx` ON `tag_mail` (`user_id_id`);--> statement-breakpoint
CREATE INDEX `tags_amiante_sid_id_idx` ON `tags_amiante` (`sid_id`);--> statement-breakpoint
CREATE INDEX `tags_plomb_sid_id_idx` ON `tags_plomb` (`sid_id`);--> statement-breakpoint
CREATE INDEX `tags_structure_sid_id_idx` ON `tags_structure` (`sid_id`);--> statement-breakpoint
CREATE INDEX `tags_termite_sid_id_idx` ON `tags_termite` (`sid_id`);--> statement-breakpoint
CREATE INDEX `user_legacy_id_etab_id_idx` ON `user_legacy` (`id_etab_id`);