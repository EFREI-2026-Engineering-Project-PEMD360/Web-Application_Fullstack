<script lang="ts">
	import { ArrowLeft, Info, Calendar, MapPin, Building2, Hash } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('fr-FR');
	}
</script>

<div class="font-[Poppins] max-w-4xl mx-auto px-4 py-8">
	<!-- Titre du projet -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">{data.projet.libelle}</h1>
		<div class="flex items-center gap-4 text-sm text-gray-500">
			<span class="flex items-center gap-1">
				<Hash class="h-4 w-4" />
				Réf: {data.projet.reference}
			</span>
			<span class="flex items-center gap-1">
				<Calendar class="h-4 w-4" />
				Démarré le {formatDate(data.projet.dateDemarrage)}
			</span>
		</div>
	</div>

	<!-- Informations détaillées -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<!-- Section Localisation -->
		<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
			<div class="flex items-center gap-3 mb-6">
				<div class="p-2 bg-emerald-50 rounded-lg">
					<MapPin class="h-6 w-6 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-gray-900">Localisation</h2>
			</div>

			<div class="space-y-4">
				<div>
					<p class="text-sm text-gray-500 mb-1">Adresse</p>
					<p class="text-base text-gray-900 font-medium">{data.projet.rue}</p>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-gray-500 mb-1">Code Postal</p>
						<p class="text-base text-gray-900 font-medium">{data.projet.cp}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 mb-1">Ville</p>
						<p class="text-base text-gray-900 font-medium">{data.projet.ville}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Section Intervenants -->
		<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
			<div class="flex items-center gap-3 mb-6">
				<div class="p-2 bg-emerald-50 rounded-lg">
					<Building2 class="h-6 w-6 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-gray-900">Intervenants</h2>
			</div>

			<div>
				<p class="text-sm text-gray-500 mb-1">Bureau d'étude / Maître d'ouvrage</p>
				<p class="text-base text-gray-900 font-medium">{data.projet.maitreDOuvrage}</p>
			</div>
		</div>

		<!-- Section Détails Techniques (Placeholder) -->
		<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
			<div class="flex items-center gap-3 mb-6">
				<div class="p-2 bg-emerald-50 rounded-lg">
					<Info class="h-6 w-6 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-gray-900">Informations Complémentaires</h2>
			</div>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-medium text-gray-900 mb-3">Informations cadastrales</h3>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div class="bg-gray-50 p-4 rounded-lg">
							<p class="text-sm text-gray-500 mb-1">Code INSEE</p>
							<p class="text-base font-medium text-gray-900">{data.projet.codeInsee}</p>
						</div>
						<div class="bg-gray-50 p-4 rounded-lg">
							<p class="text-sm text-gray-500 mb-1">Section</p>
							<p class="text-base font-medium text-gray-900">{data.projet.section}</p>
						</div>
						<div class="bg-gray-50 p-4 rounded-lg">
							<p class="text-sm text-gray-500 mb-1">Parcelle</p>
							<p class="text-base font-medium text-gray-900">{data.projet.parcelle}</p>
						</div>
					</div>
				</div>

				<div class="border-t border-gray-100 pt-6">
					<h3 class="text-lg font-medium text-gray-900 mb-3">Détails de l'opération</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<p class="text-sm text-gray-500 mb-1">Type d'opération</p>
							<p class="text-base font-medium text-gray-900">
								{data.projet.typeOperation || 'Non spécifié'}
							</p>
						</div>
						<div>
							<p class="text-sm text-gray-500 mb-1">Date de fin prévisionnelle</p>
							<p class="text-base font-medium text-gray-900">
								{data.projet.dateDeFin ? formatDate(data.projet.dateDeFin) : 'Non définie'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
