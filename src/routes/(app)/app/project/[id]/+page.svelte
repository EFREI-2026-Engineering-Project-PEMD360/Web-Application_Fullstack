<script lang="ts">
	import { ArrowLeft, Info, Calendar, MapPin, Building2, Hash } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('fr-FR');
	}
</script>

<div class="font-[Poppins] max-w-4xl mx-auto px-4 py-8">
	<!-- Fil d'ariane / Retour -->
	<div class="mb-8">
		<a
			href="/app/dashboard"
			class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
		>
			<ArrowLeft class="h-4 w-4" />
			Retour au tableau de bord
		</a>
	</div>

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

			<p class="text-gray-600 italic">
				D'autres informations relatives au projet pourraient être affichées ici, comme les types de
				missions, les intervenants additionnels, ou les documents associés.
			</p>
		</div>
	</div>
</div>
