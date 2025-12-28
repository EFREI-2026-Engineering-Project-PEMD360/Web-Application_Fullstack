<script lang="ts">
	import { ArrowLeft, Save, Building2, MapPin, Phone, Mail, Hash, Globe } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
	$: ({ etablissement, societes } = data);
</script>

<div class="font-[Poppins] max-w-4xl mx-auto px-4 py-8">
	<!-- Fil d'ariane / Retour -->
	<div class="mb-8">
		<a
			href="/app/admin/etablissements/{etablissement.id}"
			class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			Retour aux détails
		</a>
	</div>

	<!-- Titre -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Modifier l'établissement</h1>
		<p class="text-sm text-gray-500">Mettez à jour les informations de {etablissement.nom}.</p>
	</div>

	{#if form?.message}
		<div
			class="mb-6 p-4 rounded-lg {form.success === false
				? 'bg-red-50 text-red-700 border border-red-200'
				: 'bg-emerald-50 text-emerald-700 border border-emerald-200'}"
		>
			{form.message}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-8">
		<!-- Section Identifiants & Contact -->
		<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
			<div class="flex items-center gap-3 mb-6">
				<div class="p-2 bg-emerald-50 rounded-lg">
					<Globe class="h-6 w-6 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-gray-900">Identité & Contact</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-1.5 md:col-span-2">
					<label for="nom" class="text-sm font-medium text-gray-700">Nom de l'établissement</label>
					<input
						type="text"
						id="nom"
						name="nom"
						value={etablissement.nom}
						required
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-1.5 md:col-span-2">
					<label for="idSocieteId" class="text-sm font-medium text-gray-700">Société parente</label>
					<select
						id="idSocieteId"
						name="idSocieteId"
						required
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					>
						{#each societes as societe}
							<option value={societe.id} selected={societe.id === etablissement.idSocieteId}
								>{societe.nom}</option
							>
						{/each}
					</select>
				</div>

				<div class="space-y-1.5">
					<label for="raisonSocial" class="text-sm font-medium text-gray-700">Raison Sociale</label>
					<input
						type="text"
						id="raisonSocial"
						name="raisonSocial"
						value={etablissement.raisonSocial}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="siret" class="text-sm font-medium text-gray-700">SIRET</label>
					<input
						type="text"
						id="siret"
						name="siret"
						value={etablissement.siret}
						required
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="email" class="text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={etablissement.email}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="tel" class="text-sm font-medium text-gray-700">Téléphone</label>
					<input
						type="tel"
						id="tel"
						name="tel"
						value={etablissement.tel}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
			</div>
		</div>

		<!-- Section Localisation -->
		<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
			<div class="flex items-center gap-3 mb-6">
				<div class="p-2 bg-emerald-50 rounded-lg">
					<MapPin class="h-6 w-6 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-gray-900">Localisation</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-1.5 md:col-span-2">
					<label for="rue" class="text-sm font-medium text-gray-700">Adresse</label>
					<input
						type="text"
						id="rue"
						name="rue"
						value={etablissement.rue}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="cp" class="text-sm font-medium text-gray-700">Code Postal</label>
					<input
						type="text"
						id="cp"
						name="cp"
						value={etablissement.cp}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="ville" class="text-sm font-medium text-gray-700">Ville</label>
					<input
						type="text"
						id="ville"
						name="ville"
						value={etablissement.ville}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
				<div class="space-y-1.5 md:col-span-2">
					<label for="fax" class="text-sm font-medium text-gray-700">Fax</label>
					<input
						type="text"
						id="fax"
						name="fax"
						value={etablissement.fax}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 transition-all pt-4">
			<a
				href="/app/admin/etablissements/{etablissement.id}"
				class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
			>
				Annuler
			</a>
			<button
				type="submit"
				class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				<Save class="mr-2 h-4 w-4" />
				Enregistrer les modifications
			</button>
		</div>
	</form>
</div>
