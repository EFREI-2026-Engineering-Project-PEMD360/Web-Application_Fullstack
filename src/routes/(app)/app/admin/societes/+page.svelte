<script lang="ts">
	import { Plus, Eye, Building, Search, Filter, Download, MoreVertical, Phone, MapPin, X } from 'lucide-svelte';

	// Mock data as requested
	const companies = [
		{
			id: 1,
			nom: 'Dépollution Conseil',
			raisonSociale: 'Dépollution Conseil',
			rue: '7 rue Montespan',
			cp: '91000',
			ville: 'Evry-Courcouronnes',
			tel: '06 31 32 67 15',
            status: 'Actif'
		},
        {
			id: 2,
			nom: 'Bati Renov',
			raisonSociale: 'Bati Rénovation SARL',
			rue: '12 avenue de la République',
			cp: '75011',
			ville: 'Paris',
			tel: '01 42 55 88 99',
            status: 'En attente'
		}
	];

    let searchTerm = $state('');
    let isModalOpen = $state(false);
</script>

<div class="font-[Poppins]">
	<!-- En-tête -->
	<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Sociétés</h1>
			<p class="mt-1 text-sm text-gray-500">Gérez la liste des sociétés et leurs établissements rattachés.</p>
		</div>
		<button onclick={() => isModalOpen = true} class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors">
			<Plus class="mr-2 h-4 w-4" />
			Nouvelle société
		</button>
	</div>

	<!-- Toolbar -->
	<div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
		<div class="relative w-full sm:w-96">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-4 w-4 text-gray-400" />
			</div>
			<input
				type="text"
				class="block w-full rounded-md border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2"
				placeholder="Rechercher une société..."
				bind:value={searchTerm}
			/>
		</div>
		<div class="flex gap-2 w-full sm:w-auto">
			<button class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
				<Filter class="mr-2 h-4 w-4 text-gray-500" />
				Filtres
			</button>
			<button class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
				<Download class="mr-2 h-4 w-4 text-gray-500" />
				Exporter
			</button>
		</div>
	</div>

	<!-- Tableau responsive -->
	<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full min-w-max border-collapse text-left text-sm text-gray-500">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Société</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Localisation</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Contact</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900">Statut</th>
						<th scope="col" class="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 border-t border-gray-200">
					{#each companies as company}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
										{company.nom.charAt(0)}
									</div>
									<div>
										<div class="font-medium text-gray-900">{company.nom}</div>
										<div class="text-xs text-gray-500">ID: #{company.id}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="text-gray-900">{company.ville}</span>
									<span class="text-xs text-gray-500">{company.rue}, {company.cp}</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<Phone class="h-3.5 w-3.5 text-gray-400" />
									<span class="font-mono text-xs">{company.tel}</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
									{company.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
									{company.status}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex justify-end gap-2">
									<button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" title="Voir détails">
										<Eye class="h-5 w-5" />
									</button>
									<button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" title="Gérer établissements">
										<Building class="h-5 w-5" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		<!-- Pagination -->
		<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
			<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-gray-700">
						Affichage de <span class="font-medium">1</span> à <span class="font-medium">{companies.length}</span> sur <span class="font-medium">{companies.length}</span> résultats
					</p>
				</div>
				<div>
					<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
						<button class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
							<span class="sr-only">Précédent</span>
							<!-- Heroicon name: mini/chevron-left -->
							<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
							</svg>
						</button>
						<button aria-current="page" class="relative z-10 inline-flex items-center border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 focus:z-20">1</button>
						<button class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">2</button>
						<button class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">3</button>
						<button class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
							<span class="sr-only">Suivant</span>
							<!-- Heroicon name: mini/chevron-right -->
							<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
							</svg>
						</button>
					</nav>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal -->
{#if isModalOpen}
<!-- Modal Content -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div class="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900">Nouvelle société</h2>
            <button onclick={() => isModalOpen = false} class="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500">
                <X class="h-5 w-5" />
            </button>
        </div>
        <form class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-5">
                <div class="space-y-1.5">
                    <label for="nom" class="text-sm font-medium text-gray-700">Nom</label>
                    <input type="text" id="nom" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="Ex: Dépollution Conseil" />
                </div>
                <div class="space-y-1.5">
                    <label for="siret" class="text-sm font-medium text-gray-700">SIRET</label>
                    <input type="text" id="siret" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="14 chiffres" />
                </div>
            </div>
            
            <div class="space-y-1.5">
                <label for="raisonSociale" class="text-sm font-medium text-gray-700">Raison Sociale</label>
                <input type="text" id="raisonSociale" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
            </div>

            <div class="space-y-1.5">
                <label for="adresse" class="text-sm font-medium text-gray-700">Adresse</label>
                <input type="text" id="adresse" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="Numéro et rue" />
            </div>

            <div class="grid grid-cols-2 gap-5">
                <div class="space-y-1.5">
                    <label for="cp" class="text-sm font-medium text-gray-700">Code Postal</label>
                    <input type="text" id="cp" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
                </div>
                <div class="space-y-1.5">
                    <label for="ville" class="text-sm font-medium text-gray-700">Ville</label>
                    <input type="text" id="ville" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
                </div>
            </div>

            <div class="space-y-1.5">
                <label for="tel" class="text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" id="tel" class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
            </div>

            <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onclick={() => isModalOpen = false} class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Annuler
                </button>
                <button type="submit" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
                    Créer la société
                </button>
            </div>
        </form>
    </div>
</div>
{/if}

