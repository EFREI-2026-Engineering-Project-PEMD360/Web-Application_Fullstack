<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import logoPEMD from '$lib/assets/img/PEMD 360.jpg';

	let { form }: { form?: { error?: string; success?: boolean } } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	// Password strength indicator
	const passwordStrength = $derived.by(() => {
		if (!password) return { level: 0, text: '', color: '' };
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.length >= 12) strength++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[^a-zA-Z0-9]/.test(password)) strength++;

		if (strength <= 2) return { level: 1, text: 'Faible', color: 'bg-red-500' };
		if (strength <= 3) return { level: 2, text: 'Moyen', color: 'bg-yellow-500' };
		return { level: 3, text: 'Fort', color: 'bg-emerald-500' };
	});

	// Afficher les erreurs du serveur
	$effect(() => {
		if (form?.error) {
			error = form.error;
		} else if (form?.success) {
			goto('/login');
		}
	});

	function validateForm() {
		error = '';
		
		if (!name || !email || !password) {
			error = 'Tous les champs sont requis';
			return false;
		}

		if (password !== confirmPassword) {
			error = 'Les mots de passe ne correspondent pas';
			return false;
		}

		if (password.length < 8) {
			error = 'Le mot de passe doit contenir au moins 8 caractères';
			return false;
		}

		return true;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-emerald-50 px-4 py-12">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<a href="/" class="inline-block">
				<img src={logoPEMD} alt="PEMD 360" class="mx-auto h-20 w-auto" />
			</a>
		</div>

		<!-- Card -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Créer un compte</h1>
				<p class="mt-2 text-gray-600">Rejoignez PEMD 360 dès aujourd'hui</p>
			</div>
			
			{#if error}
				<div class="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800">
					<svg class="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<span class="text-sm">{error}</span>
				</div>
			{/if}

			<form 
				method="POST"
				use:enhance={() => {
					if (!validateForm()) {
						return async ({ update }) => {
							await update({ reset: false });
						};
					}
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-5"
			>
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
						Nom complet
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Jean Dupont"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							bind:value={name}
							required
						/>
					</div>
				</div>

				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Adresse email
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
						</div>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="vous@exemple.com"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							bind:value={email}
							required
						/>
					</div>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
						Mot de passe
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Minimum 8 caractères"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							bind:value={password}
							required
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							onclick={() => showPassword = !showPassword}
						>
							{#if showPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
					{#if password}
						<div class="mt-2">
							<div class="flex items-center justify-between text-xs text-gray-600 mb-1">
								<span>Force du mot de passe</span>
								<span class="font-medium">{passwordStrength.text}</span>
							</div>
							<div class="flex gap-1">
								{#each Array(3) as _, i}
									<div class="h-1 flex-1 rounded-full bg-gray-200">
										<div class="h-full rounded-full transition-all {i < passwordStrength.level ? passwordStrength.color : ''}" style="width: 100%"></div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div>
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">
						Confirmer le mot de passe
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<input
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirmer votre mot de passe"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							bind:value={confirmPassword}
							required
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							onclick={() => showConfirmPassword = !showConfirmPassword}
						>
							{#if showConfirmPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={loading}
				>
					{#if loading}
						<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Inscription en cours...</span>
					{:else}
						<span>Créer mon compte</span>
					{/if}
				</button>
			</form>

			<div class="mt-8 text-center">
				<p class="text-sm text-gray-600">
					Vous avez déjà un compte ?
					<a href="/login" class="font-semibold text-emerald-600 hover:text-emerald-700">
						Se connecter
					</a>
				</p>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<a href="/" class="text-sm text-gray-600 hover:text-emerald-600">
				← Retour à l'accueil
			</a>
		</div>
	</div>
</div>
