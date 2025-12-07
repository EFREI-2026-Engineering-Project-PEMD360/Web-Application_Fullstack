<script lang="ts">
	import logoPEMD from '$lib/assets/img/PEMD 360.jpg';
</script>

<footer class="bg-gray-900 text-white">
	<div class="container mx-auto px-4 py-12">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Contact -->
			<div>
				<h5 class="mb-4 text-lg font-semibold">Contact</h5>
				<ul class="space-y-3 text-sm text-gray-400">
					<li class="flex items-center gap-3">
						<svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						<span>florent.mouriot@depollution-conseil.fr</span>
					</li>
					<li class="flex items-center gap-3">
						<svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
							/>
						</svg>
						<span>06 31 32 67 15</span>
					</li>
					<li class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-4 w-4 text-emerald-500"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>7 rue Montespan 91000, Évry-Courcouronnes</span>
					</li>
				</ul>
			</div>

			<!-- Liens utiles -->
			<div>
				<h5 class="mb-4 text-lg font-semibold">Liens utiles</h5>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/" class="text-gray-400 transition-colors hover:text-emerald-500">Accueil</a>
					</li>
					<li>
						<a href="/about" class="text-gray-400 transition-colors hover:text-emerald-500"
							>À propos</a
						>
					</li>
					<li>
						<a href="/contact" class="text-gray-400 transition-colors hover:text-emerald-500"
							>Contact</a
						>
					</li>
					<li>
						<a href="/mentions" class="text-gray-400 transition-colors hover:text-emerald-500"
							>Mentions légales</a
						>
					</li>
				</ul>
			</div>

			<!-- Réseaux sociaux -->
			<div>
				<h5 class="mb-4 text-lg font-semibold">Réseaux sociaux</h5>
				<div class="flex items-center gap-4">
					<img src={logoPEMD} alt="PEMD 360" class="h-16 w-auto rounded bg-white object-contain" />
					<a
						href="https://fr.linkedin.com/company/depollution-conseil"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-gray-400 transition-colors hover:text-emerald-500"
					>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
							/>
						</svg>
						<span class="text-sm">LinkedIn</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="border-t border-gray-800 py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-500">
			© {new Date().getFullYear()} PEMD 360 - Dépollution Conseil. Tous droits réservés.
		</div>
	</div>
</footer>
