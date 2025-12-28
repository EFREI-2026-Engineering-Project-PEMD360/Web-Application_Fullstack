<script lang="ts">
	import type { PageData } from './$types';
	import { Plus, Eye, Pencil, Search, Filter, Download, Hash, Mail, MapPin } from 'lucide-svelte';

	export let data: PageData;
	$: ({ etablissements } = data);

	let searchTerm = '';
</script>

<div class="font-[Poppins] p-6 lg:p-8">
	<!-- En-tête -->
	<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Établissements</h1>
			<p class="mt-1 text-sm text-gray-500">Gérez les établissements de votre organisation.</p>
		</div>
		<a
			href="/app/admin/etablissements/nouveau"
			class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
		>
			<Plus class="mr-2 h-4 w-4" />
			Nouveau établissement
		</a>
	</div>

	<!-- Toolbar -->
	<div
		class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
	>
		<div class="relative w-full sm:w-96">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-4 w-4 text-gray-400" />
			</div>
			<input
				type="text"
				class="block w-full rounded-md border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2"
				placeholder="Rechercher un établissement..."
				bind:value={searchTerm}
			/>
		</div>
		<div class="flex gap-2 w-full sm:w-auto">
			<button
				class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				<Filter class="mr-2 h-4 w-4 text-gray-500" />
				Filtres
			</button>
			<button
				class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				<Download class="mr-2 h-4 w-4 text-gray-500" />
				Exporter
			</button>
		</div>
	</div>

	<!-- Tableau -->
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full min-w-max border-collapse text-left text-sm text-gray-500">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Établissement</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Localisation</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Identifiants</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Contact</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 border-t border-gray-200">
					{#each etablissements as etab}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold"
									>
										{etab.nom.charAt(0)}
									</div>
									<div>
										<div class="font-medium text-gray-900">{etab.nom}</div>
										<div class="text-xs text-gray-500 flex items-center gap-1">
											<Hash class="h-3 w-3" /> ID: #{etab.id}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="text-gray-900">{etab.ville}</span>
									<span class="text-xs text-gray-500 flex items-center gap-1">
										<MapPin class="h-3 w-3" />
										{etab.cp}
									</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
										>SIRET</span
									>
									<span class="font-mono text-gray-900">{etab.siret}</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<Mail class="h-4 w-4 text-gray-400" />
									<span class="text-gray-900">{etab.email}</span>
								</div>
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex justify-end gap-2">
									<a
										href="/app/admin/etablissements/{etab.id}"
										class="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
										title="Détails"
									>
										<Eye class="h-5 w-5" />
									</a>
									<a
										href="/app/admin/etablissements/{etab.id}/modifier"
										class="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
										title="Modifier"
									>
										<Pencil class="h-5 w-5" />
									</a>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
