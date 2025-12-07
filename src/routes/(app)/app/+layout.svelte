<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import logoPEMD from '$lib/assets/img/PEMD 360.jpg';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	// Récupérer les données de session
	const session = authClient.useSession();

	// Sidebar state
	let sidebarOpen = $state(true);

	// Configuration centralisée des liens de navigation
	const navLinks = [
		{
			href: '/app/dashboard',
			label: 'Tableau de bord',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/app/admin',
			label: 'Administration',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
		}
	];

	// Fonction pour vérifier si un lien est actif
	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	async function handleLogout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PEMD360 - Dashboard</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-gray-50 font-[Poppins]">
	<!-- Sidebar -->
	<aside
		class="flex w-64 flex-col border-r border-gray-200 bg-white transition-all duration-300 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-64'}"
	>
		<!-- Logo -->
		<div class="flex h-20 shrink-0 items-center justify-center border-b border-gray-200 px-4">
			<img src={logoPEMD} alt="PEMD 360" class="h-16 w-auto object-contain" />
		</div>

		<!-- Navigation - scrollable -->
		<nav class="flex-1 space-y-1 overflow-y-auto p-4">
			{#each navLinks as link}
				<a
					href={link.href}
					class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors {isActive(link.href)
						? 'bg-emerald-600 text-white shadow-md'
						: 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={link.icon}
						/>
					</svg>
					<span class="font-medium">{link.label}</span>
				</a>
			{/each}
		</nav>

		<!-- User Profile Section - Fixed at bottom -->
		<div class="shrink-0 border-t border-gray-200 p-4">
			{#if $session.data?.user}
				<div class="mb-4 rounded-lg bg-gray-50 p-3">
					<div class="mb-2 flex items-center gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold"
						>
							{$session.data.user.name?.charAt(0).toUpperCase() || 'U'}
						</div>
						<div class="flex-1 overflow-hidden">
							<p class="truncate font-semibold text-gray-900">{$session.data.user.name}</p>
							<p class="truncate text-xs text-gray-500">
								{$session.data.user.role || 'Utilisateur'}
							</p>
						</div>
					</div>
					<p class="truncate text-xs text-gray-600">{$session.data.user.email}</p>
				</div>
			{/if}

			<button
				onclick={handleLogout}
				class="flex w-full items-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-red-600 transition-colors hover:bg-red-100"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				<span class="font-medium">Déconnexion</span>
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto">
	

		<!-- Page Content -->
		<div class="p-6">
			{@render children()}
		</div>
	</main>
</div>
