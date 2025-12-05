<script lang="ts">
	import logoDC from '$lib/assets/img/Logo_DC.jpg';

	const services = [
		'Numérisation de bâtiments',
		'Création d\'un jumeau numérique',
		'Plan 2D / DWG',
		'Réalisation du diagnostic PEMD',
		'Estimation de la masse des déchets',
		'Outil collaboratif du chantier'
	];
</script>

<svelte:head>
	<title>À propos - PEMD 360</title>
	<meta name="description" content="Découvrez Dépollution Conseil, bureau d'études spécialisé en Sites et Sols Pollués depuis 2014." />
</svelte:head>

<!-- Hero Banner -->
<section
	class="relative bg-cover bg-center py-16"
	style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop')"
>
	<div class="absolute inset-0 bg-black/60"></div>
	<div class="container relative z-10 mx-auto px-4 text-white">
		<h1 class="mb-4 text-4xl font-bold md:text-5xl">À propos de nous</h1>
		<nav aria-label="Fil d'Ariane">
			<ol class="flex items-center gap-2 text-sm">
				<li>
					<a href="/" class="flex items-center gap-2 transition-colors hover:text-emerald-400">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						Accueil
					</a>
				</li>
				<li class="text-gray-400">/</li>
				<li class="text-emerald-400">À propos de nous</li>
			</ol>
		</nav>
	</div>
</section>

<!-- About Section -->
<section class="py-16 lg:py-24">
	<div class="container mx-auto px-4">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Image -->
			<div class="flex justify-center">
				<div class="overflow-hidden rounded-lg bg-white p-6 shadow-xl">
					<img src={logoDC} alt="Dépollution Conseil" class="h-auto max-w-sm" />
				</div>
			</div>

			<!-- Content -->
			<div>
				<span class="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
					Qui sommes-nous ?
				</span>
				<h2 class="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">Dépollution Conseil</h2>
				
				<div class="space-y-4 text-gray-600">
					<p class="text-justify leading-relaxed">
						Depuis 2014, Dépollution Conseil, c'est avant tout un savoir-faire rigoureux, des études 
						précises et un accompagnement soigné mis en œuvre pour mener à bien vos projets.
					</p>
					<p class="text-justify leading-relaxed">
						Bureau d'études spécialisé en Sites et Sols Pollués, nous vous accompagnons dans la 
						prospection de pollution, l'évaluation des risques et l'identification de solutions de 
						gestion adaptées à vos besoins.
					</p>
				</div>

				<!-- Services List -->
				<div class="my-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#each services as service}
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg class="h-5 w-5 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span>{service}</span>
						</div>
					{/each}
				</div>

				<!-- Contact Info -->
				<div class="flex flex-wrap items-center gap-6 border-y border-gray-200 py-4">
					<div class="border-l-2 border-emerald-500 pl-4">
						<h5 class="font-semibold text-gray-900">Groupe Dépollution Conseil</h5>
					</div>
					<div class="border-l-2 border-emerald-500 pl-4">
						<h5 class="font-semibold text-gray-900">06 31 32 67 15</h5>
						<p class="text-xs text-gray-500">Vous pouvez nous poser des questions</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Innovation Section -->
<section class="bg-gray-50 py-16 lg:py-24">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl text-center">
			<span class="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
				Vers une économie circulaire
			</span>
			<h2 class="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
				Dépollution Conseil vous propose une solution innovante
			</h2>
			<p class="text-lg leading-relaxed text-gray-600">
				Depuis 2021, nous proposons un nouveau service dans le domaine de l'économie circulaire. 
				Cette nouvelle branche a permis la création d'une application web permettant d'élaborer 
				des diagnostics Produits, Équipements, Matériaux et Déchets (PEMD) en ligne.
			</p>
			
			<!-- CTA Button -->
			<div class="mt-8">
				<a
					href="/contact"
					class="inline-block rounded-md bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
				>
					Nous contacter
				</a>
			</div>
		</div>
	</div>
</section>
