<script lang="ts">
	import { goto } from '$app/navigation';
	import { ShieldAlert } from 'lucide-svelte';

	function goBack() {
		goto('/app/dashboard');
	}
</script>

<svelte:head>
	<title>Accès Non Autorisé - PEMD360</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 font-[Poppins]">
	<div class="w-full max-w-md text-center">
		<div class="mb-6 flex justify-center">
			<div class="rounded-full bg-red-100 p-6">
				<ShieldAlert class="h-16 w-16 text-red-600" />
			</div>
		</div>

		<h1 class="mb-4 text-4xl font-bold text-gray-900">Accès Non Autorisé</h1>

		<p class="mb-8 text-lg text-gray-600">
			Vous n'avez pas les permissions nécessaires pour accéder à cette page. Cette section est
			réservée aux administrateurs.
		</p>

		<button
			on:click={goBack}
			class="rounded-lg bg-emerald-600 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
		>
			Retour au Dashboard
		</button>
	</div>
</div>
