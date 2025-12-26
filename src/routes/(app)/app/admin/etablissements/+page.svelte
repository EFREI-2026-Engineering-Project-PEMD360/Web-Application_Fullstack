<script lang="ts">
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';

	export let data: PageData;
	$: ({ etablissements } = data);
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Établissements</h1>
			<p class="text-muted-foreground">Gérez les établissements de votre organisation.</p>
		</div>
		<a href="/app/admin/etablissements/nouveau" class="btn btn-primary">
			<Plus class="h-4 w-4" /> Nouveau établissement
		</a>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each etablissements as etab}
			<div class="card bg-base-100 text-base-content shadow-xl border border-base-300">
				<div class="card-body">
					<div class="flex items-center gap-2">
						<div class="badge badge-primary badge-outline">#{etab.id}</div>
						<h2 class="card-title text-lg">{etab.nom}</h2>
					</div>
					<div class="mt-4 space-y-2 text-sm text-muted-foreground">
						<div class="flex items-center gap-2">
							<span class="font-semibold text-base-content/70">Ville:</span>
							<span>{etab.ville} ({etab.cp})</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-semibold text-base-content/70">SIRET:</span>
							<span class="font-mono">{etab.siret}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-semibold text-base-content/70">Email:</span>
							<span>{etab.email}</span>
						</div>
					</div>
					<div class="card-actions justify-end mt-4">
						<a href="/app/admin/etablissements/{etab.id}" class="btn btn-sm btn-ghost">Détails</a>
						<button class="btn btn-sm btn-primary">Modifier</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
