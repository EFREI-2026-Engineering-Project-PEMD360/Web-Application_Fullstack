import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Données de démonstration basées sur l'image
	const projets = [
		{
			id: 'demo-001',
			reference: 'Projet démonstration',
			libelle: 'Projet démonstration DC',
			rue: '9 rue Clément Ader',
			cp: 60200,
			ville: 'Compiègne',
			maitreDOuvrage: 'Dépollution conseil',
			dateDemarrage: new Date('2022-02-01')
		},
		{
			id: '22068',
			reference: '22068',
			libelle: 'Saint-Cloud - I3F - Réhabilitation de 110 logements sociaux',
			rue: '9B rue de la Porte Jaune',
			cp: 92210,
			ville: 'Saint-Cloud',
			maitreDOuvrage: 'Dépollution conseil',
			dateDemarrage: new Date('2023-01-01')
		},
		{
			id: '22055',
			reference: '22055',
			libelle: 'Paris - RIVP - Démolition, réhabilitation, surélévation et construction neuve d\'un ensemble immobilier de 33 logements',
			rue: 'Doudeauville',
			cp: 75018,
			ville: 'Paris',
			maitreDOuvrage: 'Dépollution conseil',
			dateDemarrage: new Date('2023-01-26')
		}
	];

	return {
		projets
	};
};