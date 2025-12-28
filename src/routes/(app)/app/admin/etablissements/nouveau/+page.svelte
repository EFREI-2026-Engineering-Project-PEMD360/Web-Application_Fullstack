<script lang="ts">
	import {
		ArrowLeft,
		Save,
		Building2,
		MapPin,
		Phone,
		Mail,
		Hash,
		Globe,
		Plus
	} from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
	$: ({ societes } = data);

	let data_form = form?.data || {
		nom: '',
		idSocieteId: '',
		raisonSocial: '',
		rue: '',
		cp: '',
		ville: '',
		tel: '',
		fax: '',
		email: '',
		siret: ''
	};
</script>

<div class="font-[Poppins] max-w-4xl mx-auto px-4 py-8">
	<!-- Fil d'ariane / Retour -->
	<div class="mb-8">
		<a
			href="/app/admin/etablissements"
			class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			Retour à la liste
		</a>
	</div>

	<!-- Titre -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Nouveau établissement</h1>
		<p class="text-sm text-gray-500">Créez un nouvel établissement dans votre organisation.</p>
	</div>

	{#if form?.message}
		<div class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
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
						value={data_form.nom}
						required
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="Ex: Agence Paris"
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
						<option value="" disabled selected={!data_form.idSocieteId}
							>Sélectionnez une société</option
						>
						{#each societes as societe}
							<option value={societe.id} selected={societe.id === data_form.idSocieteId}
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
						value={data_form.raisonSocial}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="siret" class="text-sm font-medium text-gray-700">SIRET</label>
					<input
						type="text"
						id="siret"
						name="siret"
						value={data_form.siret}
						required
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="14 chiffres"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="email" class="text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={data_form.email}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="contact@etab.com"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="tel" class="text-sm font-medium text-gray-700">Téléphone</label>
					<input
						type="tel"
						id="tel"
						name="tel"
						value={data_form.tel}
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
						value={data_form.rue}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="123 rue de la Paix"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="cp" class="text-sm font-medium text-gray-700">Code Postal</label>
					<input
						type="text"
						id="cp"
						name="cp"
						value={data_form.cp}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="75000"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="ville" class="text-sm font-medium text-gray-700">Ville</label>
					<input
						type="text"
						id="ville"
						name="ville"
						value={data_form.ville}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
						placeholder="Paris"
					/>
				</div>
				<div class="space-y-1.5 md:col-span-2">
					<label for="fax" class="text-sm font-medium text-gray-700">Fax</label>
					<input
						type="text"
						id="fax"
						name="fax"
						value={data_form.fax}
						class="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
					/>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 transition-all pt-4">
			<a
				href="/app/admin/etablissements"
				class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
			>
				Annuler
			</a>
			<button
				type="submit"
				class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				<Plus class="mr-2 h-4 w-4" />
				Créer l'établissement
			</button>
		</div>
	</form>
</div>
