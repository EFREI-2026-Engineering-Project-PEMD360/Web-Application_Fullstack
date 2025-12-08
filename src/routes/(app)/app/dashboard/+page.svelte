<script lang="ts">
	import { Info, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('fr-FR');
	}
</script>

<div class="font-[Poppins]">
	<!-- En-tête -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">La liste des projets</h1>
	</div>

	<!-- Tableau responsive avec scroll horizontal -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
		<table class="w-full min-w-max border-collapse">
			<!-- En-tête du tableau -->
			<thead class="bg-gray-50">
				<tr>
					<th class="border-b border-gray-200 px-6 py-4 text-left">
						<input
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
						/>
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Reference
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Nom du projet
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Adresse
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Ville
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Bureau d'étude
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Date demarrage
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Information du projet
					</th>
					<th
						class="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900"
					>
						Charger le modèle
					</th>
				</tr>
			</thead>

			<!-- Corps du tableau -->
			<tbody class="divide-y divide-gray-200">
				{#each data.projets as projet (projet.id)}
					<tr class="transition-colors hover:bg-gray-50">
						<!-- Checkbox -->
						<td class="px-6 py-4">
							<input
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
							/>
						</td>

						<!-- Reference -->
						<td class="px-6 py-4">
							<span class="text-sm font-medium text-gray-900">{projet.reference}</span>
						</td>

						<!-- Nom du projet -->
						<td class="px-6 py-4">
							<span class="text-sm text-gray-900">{projet.libelle}</span>
						</td>

						<!-- Adresse -->
						<td class="px-6 py-4">
							<span class="text-sm text-gray-700">{projet.rue}{projet.cp}</span>
						</td>

						<!-- Ville -->
						<td class="px-6 py-4">
							<span class="text-sm text-gray-700">{projet.ville}</span>
						</td>

						<!-- Bureau d'étude -->
						<td class="px-6 py-4">
							<span class="text-sm text-gray-700">{projet.maitreDOuvrage}</span>
						</td>

						<!-- Date demarrage -->
						<td class="px-6 py-4">
							<span class="text-sm text-gray-700">{formatDate(projet.dateDemarrage)}</span>
						</td>

						<!-- Information du projet -->
						<td class="px-6 py-4">
							<button
								class="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
							>
								<Info class="h-4 w-4" />
								Infos
							</button>
						</td>

						<!-- Charger le modèle -->
						<td class="px-6 py-4">
							<button
								class="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
							>
								<Eye class="h-4 w-4" />
								Voir le Modèle
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Message si aucun projet -->
	{#if data.projets.length === 0}
		<div class="mt-8 text-center">
			<p class="text-gray-500">Aucun projet disponible pour le moment.</p>
		</div>
	{/if}
</div>

