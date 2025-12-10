<script lang="ts">
	import type { PageProps } from './$types';
	import { 
		Building2, 
		Clock,
        MapPin,
        Calendar
	} from 'lucide-svelte';

	let { data }: PageProps = $props();

	const recentActivity = [
		{ user: 'Jean Dupont', action: 'a créé le projet', target: 'Réhabilitation Tour A', time: 'Il y a 2h', avatar: 'JD' },
		{ user: 'Marie Martin', action: 'a ajouté un diagnostic', target: 'Amiante - Batiment B', time: 'Il y a 4h', avatar: 'MM' },
		{ user: 'Admin', action: 'a modifié la société', target: 'Dépollution Conseil', time: 'Il y a 1j', avatar: 'AD' },
        { user: 'Pierre Durand', action: 'a supprimé le document', target: 'Plan de retrait.pdf', time: 'Il y a 2j', avatar: 'PD' }
	];

    const latestCompanies = [
        { name: 'Dépollution Conseil', city: 'Evry-Courcouronnes', date: '10/12/2025', status: 'Actif' },
        { name: 'Bati Rénovation SARL', city: 'Paris', date: '09/12/2025', status: 'En attente' },
        { name: 'Eco Construction', city: 'Lyon', date: '08/12/2025', status: 'Actif' },
        { name: 'Grand Paris Aménagement', city: 'Saint-Denis', date: '07/12/2025', status: 'Actif' }
    ];
</script>

<div class="font-[Poppins]">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
		<p class="mt-1 text-sm text-gray-500">Bienvenue dans l'interface d'administration.</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Latest Companies -->
		<div class="bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <Building2 class="h-5 w-5 text-gray-400" />
                    <h2 class="text-lg font-medium text-gray-900">Dernières sociétés ajoutées</h2>
                </div>
                <a href="/app/admin/societes" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Voir tout</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-500">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 font-medium text-gray-900">Nom</th>
                            <th scope="col" class="px-6 py-3 font-medium text-gray-900">Ville</th>
                            <th scope="col" class="px-6 py-3 font-medium text-gray-900">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each latestCompanies as company}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-1.5">
                                        <MapPin class="h-3.5 w-3.5 text-gray-400" />
                                        {company.city}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-1.5">
                                        <Calendar class="h-3.5 w-3.5 text-gray-400" />
                                        {company.date}
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <Clock class="h-5 w-5 text-gray-400" />
                    <h2 class="text-lg font-medium text-gray-900">Activité récente</h2>
                </div>
            </div>
			<ul class="divide-y divide-gray-200">
				{#each recentActivity as activity}
					<li class="px-6 py-4 hover:bg-gray-50 transition-colors">
						<div class="flex space-x-3">
                            <div class="flex-shrink-0">
                                <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <span class="text-xs font-bold leading-none">{activity.avatar}</span>
                                </span>
                            </div>
							<div class="flex-1 space-y-1">
								<div class="flex items-center justify-between">
									<h3 class="text-sm font-medium text-gray-900">{activity.user}</h3>
									<p class="text-xs text-gray-500">{activity.time}</p>
								</div>
								<p class="text-sm text-gray-500">
									{activity.action} <span class="font-medium text-gray-900">{activity.target}</span>
								</p>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
