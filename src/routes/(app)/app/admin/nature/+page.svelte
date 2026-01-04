<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, scale } from 'svelte/transition';
	import { Pencil, Trash2, Plus, X, Save } from 'lucide-svelte';

	let { data } = $props();

	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isEditMode = $state(false);
	
	let currentNature = $state<any>(null);

	// Form defaults
	let initialForm = {
		id: '',
		nature: '',
		reutilisation: 0,
		recyclable: 0,
		valorisationMatiere: 0,
		valorisationEnergetique: 0,
		densite: null,
		stockage: '',
		codeDechet: null,
		ecoOrganismeRep: '',
		incinerationSansValorisationEnergetique: 0,
		nonValorisation: 0
	};
	
	let form = $state({ ...initialForm });

	function openCreateModal() {
		isEditMode = false;
		form = { ...initialForm };
		isModalOpen = true;
	}

	function openEditModal(nature: any) {
		isEditMode = true;
		form = { ...nature };
		isModalOpen = true;
	}

	function openDeleteModal(nature: any) {
		currentNature = nature;
		isDeleteModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		isDeleteModalOpen = false;
		currentNature = null;
	}

	function handleFormResult() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				closeModal();
				await update();
			}
		};
	}
</script>

<svelte:head>
	<title>Admin · Nature</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Gestion des Natures</h1>
			<p class="text-sm text-gray-500 mt-1">Gérez la liste des natures de déchets et leurs propriétés.</p>
		</div>
		<button
			onclick={openCreateModal}
			class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
		>
			<Plus class="w-4 h-4" />
			Ajouter
		</button>
	</div>

	<!-- Table -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-600">
				<thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
					<tr>
						<th class="px-6 py-4">Nature</th>
						<th class="px-6 py-4">Code Déchet</th>
						<th class="px-6 py-4">Densité</th>
						<th class="px-6 py-4 text-center">Recyclable</th>
						<th class="px-6 py-4 text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#if data.natures.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-gray-400">
								Aucune nature enregistrée.
							</td>
						</tr>
					{:else}
						{#each data.natures as nature}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4 font-medium text-gray-900">{nature.nature}</td>
								<td class="px-6 py-4 font-mono text-gray-500">{nature.codeDechet || '-'}</td>
								<td class="px-6 py-4">{nature.densite || '-'}</td>
								<td class="px-6 py-4 text-center">
									<div class="inline-flex items-center justify-center w-6 h-6 rounded-full {nature.recyclable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}">
										{#if nature.recyclable}✓{/if}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center justify-center gap-2">
										<button
											onclick={() => openEditModal(nature)}
											class="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
											title="Modifier"
										>
											<Pencil class="w-4 h-4" />
										</button>
										<button
											onclick={() => openDeleteModal(nature)}
											class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											title="Supprimer"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Create/Edit Modal -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" transition:fade onclick={closeModal}></div>
		<div
			class="relative w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
			transition:scale={{ start: 0.95 }}
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
				<h3 class="text-lg font-semibold text-gray-900">
					{isEditMode ? 'Modifier la nature' : 'Ajouter une nature'}
				</h3>
				<button onclick={closeModal} class="text-gray-400 hover:text-gray-500 p-1 rounded-lg hover:bg-gray-100">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="overflow-y-auto p-6">
				<form
					action={isEditMode ? '?/update' : '?/create'}
					method="POST"
					use:enhance={handleFormResult}
					id="natureForm"
					class="space-y-6"
				>
					{#if isEditMode}
						<input type="hidden" name="id" value={form.id} />
					{/if}

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="sm:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nature</label>
							<input
								type="text"
								name="nature"
								required
								bind:value={form.nature}
								class="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
								placeholder="Ex: Béton"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Code Déchet</label>
							<input
								type="number"
								name="codeDechet"
								bind:value={form.codeDechet}
								class="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Densité</label>
							<input
								type="number"
								step="0.01"
								name="densite"
								bind:value={form.densite}
								class="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Stockage</label>
							<input
								type="text"
								name="stockage"
								bind:value={form.stockage}
								class="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Eco Organisme REP</label>
							<input
								type="text"
								name="ecoOrganismeRep"
								bind:value={form.ecoOrganismeRep}
								class="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
							/>
						</div>
					</div>

					<div class="border-t border-gray-100 pt-6">
						<h4 class="text-sm font-medium text-gray-900 mb-4">Propriétés (0 ou 1)</h4>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{#each [
								{ key: 'reutilisation', label: 'Réutilisation' },
								{ key: 'recyclable', label: 'Recyclable' },
								{ key: 'valorisationMatiere', label: 'Valorisation Matière' },
								{ key: 'valorisationEnergetique', label: 'Valorisation Énergétique' },
								{ key: 'incinerationSansValorisationEnergetique', label: 'Incinération sans val. énerg.' },
								{ key: 'nonValorisation', label: 'Non Valorisation' }
							] as item}
								<div class="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
									<input
										type="checkbox"
										id={item.key}
										checked={Boolean(form[item.key])}
										onchange={(e) => form[item.key] = e.currentTarget.checked ? 1 : 0}
										class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
									>
									<input type="hidden" name={item.key} value={form[item.key]} />
									<label for={item.key} class="text-sm text-gray-700 cursor-pointer select-none flex-1">
										{item.label}
									</label>
								</div>
							{/each}
						</div>
					</div>
				</form>
			</div>

			<div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
				<button
					type="button"
					onclick={closeModal}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
				>
					Annuler
				</button>
				<button
					type="submit"
					form="natureForm"
					class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
				>
					{isEditMode ? 'Enregistrer' : 'Créer'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if isDeleteModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" transition:fade onclick={closeModal}></div>
		<div
			class="relative w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden p-6 text-center"
			transition:scale={{ start: 0.95 }}
		>
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
				<Trash2 class="h-6 w-6 text-red-600" />
			</div>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">Supprimer la nature</h3>
			<p class="text-sm text-gray-500 mb-6">
				Êtes-vous sûr de vouloir supprimer "{currentNature?.nature}" ? Cette action est irréversible.
			</p>
			
			<form action="?/delete" method="POST" use:enhance={handleFormResult} class="flex gap-3 justify-center">
				<input type="hidden" name="id" value={currentNature?.id} />
				<button
					type="button"
					onclick={closeModal}
					class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
				>
					Annuler
				</button>
				<button
					type="submit"
					class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
				>
					Supprimer
				</button>
			</form>
		</div>
	</div>
{/if}
