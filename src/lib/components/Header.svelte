<script lang="ts">
	import logoPEMD from '$lib/assets/img/pemd360.png';
	import logoDC from '$lib/assets/img/depollution_conseil.png';

	let { user = null } = $props<{ user: any }>();
	let mobileMenuOpen = $state(false);
</script>

<header class="sticky top-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto px-4 py-3">
		<div class="flex items-center justify-between">
			<!-- Logos -->
			<div class="flex items-center gap-4">
				<a href="/">
					<img src={logoPEMD} alt="PEMD 360" class="h-16 w-auto object-contain" />
				</a>
				<a href="https://depollution-conseil.fr" target="_blank" rel="noopener noreferrer">
					<img src={logoDC} alt="Dépollution Conseil" class="h-14 w-auto object-contain" />
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center gap-6 md:flex">
				<a href="/" class="font-medium text-gray-700 transition-colors hover:text-emerald-600"
					>Accueil</a
				>
				<a href="/about" class="font-medium text-gray-700 transition-colors hover:text-emerald-600"
					>À propos</a
				>
				<a
					href="/contact"
					class="font-medium text-gray-700 transition-colors hover:text-emerald-600">Contact</a
				>
				{#if user}
					<a
						href="/app/dashboard"
						class="rounded-md border-2 border-emerald-600 bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
					>
						Tableau de bord
					</a>
				{:else}
					<a
						href="/login"
						class="rounded-md border-2 border-emerald-600 px-4 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
					>
						Se connecter
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button
				class="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileMenuOpen}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					{/if}
				</svg>
			</button>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="mt-4 border-t pt-4 md:hidden">
				<div class="flex flex-col gap-3">
					<a
						href="/"
						class="font-medium text-gray-700 transition-colors hover:text-emerald-600"
						onclick={() => (mobileMenuOpen = false)}>Accueil</a
					>
					<a
						href="/about"
						class="font-medium text-gray-700 transition-colors hover:text-emerald-600"
						onclick={() => (mobileMenuOpen = false)}>À propos</a
					>
					<a
						href="/contact"
						class="font-medium text-gray-700 transition-colors hover:text-emerald-600"
						onclick={() => (mobileMenuOpen = false)}>Contact</a
					>
					{#if user}
						<a
							href="/app/dashboard"
							class="w-fit rounded-md border-2 border-emerald-600 bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
							onclick={() => (mobileMenuOpen = false)}
						>
							Tableau de bord
						</a>
					{:else}
						<a
							href="/login"
							class="w-fit rounded-md border-2 border-emerald-600 px-4 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
							onclick={() => (mobileMenuOpen = false)}
						>
							Se connecter
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>
