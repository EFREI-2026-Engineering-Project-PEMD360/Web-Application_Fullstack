<script lang="ts">
	import { onMount } from 'svelte';
	import logoPEMD from '$lib/assets/img/PEMD 360.jpg';
	import slideNumerisation from '$lib/assets/img/dépollution_8036_Copie.jpg';
	import slideSuivi from '$lib/assets/img/suivi.jpg';
	import slideDiagnostic from '$lib/assets/img/model_accueil.jpg';

	// Carousel state
	let currentSlide = $state(0);
	let autoplayInterval: ReturnType<typeof setInterval>;

	const slides = [
		{
			title: 'NUMÉRISATION',
			description:
				"A l'aide d'une caméra 3D, nous réalisons une numérisation de vos bâtiments afin de concevoir un jumeau numérique de ces derniers.",
			image: slideNumerisation
		},
		{
			title: 'SUIVI DE CHANTIER',
			description:
				'Accompagnement des acteurs sur les différentes phases du chantier, des diagnostics au suivi de chantier.',
			image: slideSuivi
		},
		{
			title: 'DIAGNOSTIC PEMD',
			description:
				"Réalisation du diagnostic Produits, Équipements, Matériaux et Déchets à l'aide de notre application web.",
			image: slideDiagnostic
		}
	];

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	}

	function goToSlide(index: number) {
		currentSlide = index;
	}

	onMount(() => {
		autoplayInterval = setInterval(nextSlide, 5000);
		return () => clearInterval(autoplayInterval);
	});
</script>
<svelte:head>
	<title>PEMD 360</title>
	<meta name="description" content="Contactez Dépollution Conseil pour vos projets de diagnostic PEMD. Nous sommes à votre écoute." />
</svelte:head>

<!-- Hero Carousel -->
<section class="relative h-[600px] w-full overflow-hidden">
	{#each slides as slide, index}
		<div
			class="absolute inset-0 transition-opacity duration-700 ease-in-out {index === currentSlide
				? 'opacity-100'
				: 'pointer-events-none opacity-0'}"
		>
			<!-- Background Image -->
			<div
				class="absolute inset-0 bg-cover bg-center"
				style="background-image: url('{slide.image}')"
			>
				<div class="absolute inset-0 bg-black/50"></div>
			</div>

			<!-- Content -->
			<div class="container relative z-10 mx-auto flex h-full items-center px-4">
				<div class="max-w-2xl text-white">
					<h1 class="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{slide.title}</h1>
					<p class="mb-8 text-lg leading-relaxed md:text-xl">{slide.description}</p>
					<div class="flex flex-wrap gap-4">
						<a
							href="#pemd"
							class="rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
						>
							En savoir plus
						</a>
						<a
							href="/about"
							class="rounded-md border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
						>
							Notre entreprise
						</a>
					</div>
				</div>
			</div>
		</div>
	{/each}

	<!-- Navigation Arrows -->
	<button
		onclick={prevSlide}
		class="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40 md:block"
		aria-label="Previous slide"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<button
		onclick={nextSlide}
		class="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40 md:block"
		aria-label="Next slide"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>

	<!-- Pagination Dots -->
	<div class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
		{#each slides as _, index}
			<button
				onclick={() => goToSlide(index)}
				class="h-3 w-3 rounded-full transition-colors {index === currentSlide
					? 'bg-emerald-500'
					: 'bg-white/50 hover:bg-white/80'}"
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</section>

<!-- Diagnostic PEMD Section -->
<section id="pemd" class="bg-gray-50 py-16 lg:py-24">
	<div class="container mx-auto px-4">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Content -->
			<div class="order-2 lg:order-1">
				<span class="mb-2 inline-block text-sm font-semibold tracking-wider text-emerald-600"
					>NOTRE ACTIVITÉ</span
				>
				<h2 class="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">Le Diagnostic PEMD</h2>
				<div class="space-y-4 text-gray-600">
					<p class="text-justify leading-relaxed">
						<a
							href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047506328"
							target="_blank"
							rel="noopener noreferrer"
							class="text-emerald-600 hover:underline"
						>
							L'arrêté d'application du 26 mars 2023
						</a>, impose au maître d'ouvrage de réaliser depuis le 1<sup>er</sup> juillet 2023 un diagnostic
						Produits, Équipements, Matériaux et Déchets (PEMD) pour tout projet de démolition ou de rénovation
						significative de bâtiments.
					</p>
					<p class="text-justify leading-relaxed">
						Dans un contexte d'économie circulaire, ce diagnostic vise à réduire la quantité de
						déchets provenant des chantiers du BTP en accordant une part plus importante au réemploi.
					</p>
					<p class="text-justify leading-relaxed">
						Conformément au décret n°2021-872 du 30 juin 2021 recodifiant la partie réglementaire du
						livre 1<sup>er</sup> du code de la construction et de l'habitation, le diagnostic PEMD doit
						permettre de réaliser un inventaire des éléments constitutifs d'un bâtiment en intégrant les
						risques amiante, plomb, termite et structure.
					</p>
				</div>

				<!-- Diagnostics List -->
				<div class="my-6 grid grid-cols-2 gap-3">
					{#each ['Diagnostic amiante', 'Diagnostic plomb', 'Diagnostic termites', 'Diagnostic structure'] as diagnostic}
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg class="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span>{diagnostic}</span>
						</div>
					{/each}
				</div>

				<p class="mb-6 text-gray-600">
					Dépollution Conseil vous propose grâce à l'utilisation de sa solution innovante de
					réaliser le diagnostic PEMD de votre projet.
				</p>

				<!-- Contact Info -->
				<div
					class="flex flex-wrap items-center gap-6 border-y border-gray-200 py-4 text-sm md:text-base"
				>
					<div class="border-l-2 border-emerald-500 pl-4">
						<h5 class="font-semibold text-gray-900">Dépollution Conseil</h5>
					</div>
					<div class="border-l-2 border-emerald-500 pl-4">
						<h5 class="font-semibold text-gray-900">06 31 32 67 15</h5>
						<p class="text-xs text-gray-500">Vous pouvez nous poser des questions</p>
					</div>
				</div>
			</div>

			<!-- Image -->
			<div class="order-1 lg:order-2">
				<div class="overflow-hidden rounded-lg border-4 border-white bg-white p-4 shadow-xl">
					<img src={logoPEMD} alt="PEMD 360" class="mx-auto mb-4 h-auto w-full max-w-md" />
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-linear-to-r from-emerald-600 to-emerald-700 py-12">
	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
			<div>
				<h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">
					Nous vous guidons au mieux
				</h2>
				<p class="text-emerald-100">
					Pour tous vos projets de démolition ou de rénovation significative, nous pouvons répondre
					à vos besoins.
				</p>
			</div>
			<a
				href="/contact"
				class="shrink-0 rounded-md border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-emerald-700"
			>
				Demander un devis
			</a>
		</div>
	</div>
</section>

<!-- Why Us Section -->
<section id="services" class="bg-gray-50 py-16 lg:py-24">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl lg:p-12">
			<span class="mb-2 inline-block text-sm font-semibold tracking-wider text-emerald-600">
				POURQUOI DÉPOLLUTION CONSEIL ?
			</span>
			<h2 class="mb-10 text-3xl font-bold text-gray-900 lg:text-4xl">
				Nous révolutionnons les anciennes méthodes de travail
			</h2>

			<ol class="space-y-8">
				{#each [{ num: '01', title: 'Digitalisation de vos chantiers', desc: "A l'aide d'une caméra 3D, nous digitalisons vos chantiers pour leur créer un jumeau numérique" }, { num: '02', title: 'Centralisation de vos données', desc: "Nous regroupons l'ensemble de vos données sur notre plateforme afin de vous en faciliter l'accès" }, { num: '03', title: 'Collaboration entre partenaires', desc: 'Vous avez un accès facile à notre réseau de partenaires pour une collaboration optimale' }, { num: '04', title: 'Réduction de vos coûts', desc: 'Réduisez vos coûts grâce à notre solution digitale' }] as item}
					<li class="flex gap-6">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600"
						>
							{item.num}
						</div>
						<div>
							<h5 class="mb-1 text-lg font-semibold text-gray-900">{item.title}</h5>
							<p class="text-gray-600">{item.desc}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<!-- Video/CTA Section -->
<section
	class="relative bg-cover bg-center bg-fixed py-20 lg:py-32"
	style="background-image: url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80&auto=format&fit=crop')"
>
	<div class="absolute inset-0 bg-gray-900/70"></div>
	<div class="container relative z-10 mx-auto px-4">
		<div class="mx-auto flex max-w-3xl flex-col items-center text-center">
			<!-- Play Button -->
			<a
				href="https://www.youtube.com/watch?v=JZrKEvf6SVY"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Regarder la vidéo"
				class="group mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white transition-transform hover:scale-110"
			>
				<svg class="h-8 w-8 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
					/>
				</svg>
			</a>

			<span class="mb-3 text-sm font-semibold tracking-wider text-emerald-400">
				NOUS FAISONS LA DIFFÉRENCE
			</span>
			<h2 class="mb-8 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
				La meilleure solution pour réaliser votre diagnostic
			</h2>
			<a
				href="#pemd"
				class="inline-block rounded-md bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
			>
				En savoir plus
			</a>
		</div>
	</div>
</section>