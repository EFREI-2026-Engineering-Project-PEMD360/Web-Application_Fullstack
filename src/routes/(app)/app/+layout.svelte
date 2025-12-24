<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import logoPEMD from '$lib/assets/img/pemd360.png';
	import favicon from '$lib/assets/favicon.png';
	import {
		Menu,
		Gauge,
		ClipboardList,
		ClipboardList as ClipboardListAlt,
		Grid3x3,
		FolderOpen,
		LogOut,
		ShieldUser
	} from 'lucide-svelte';

	let { children, data } = $props();

	// Récupérer les données de session
	const session = authClient.useSession();

	// Récupérer isAdmin depuis les données du serveur avec $derived
	const isAdmin = $derived(data.isAdmin);

	// Sidebar state
	let sidebarOpen = $state(true);

	// Configuration centralisée des liens de navigation
	const allNavLinks: Array<{ href: string; label: string; icon: any; adminOnly?: boolean }> = [
		{
			href: '/app/dashboard',
			label: 'Mes projets',
			icon: Menu
		},
		{
			href: '/app/admin',
			label: 'Administration DB',
			icon: Gauge,
			adminOnly: true
		},
		{
			href: '/app/admin-db',
			label: 'Utilisateurs',
			icon: ShieldUser
		},
		{
			href: '/app/inventaire-risques',
			label: 'Inventaire risques',
			icon: ClipboardList
		},
		{
			href: '/app/inventaire-pemd',
			label: 'Inventaire PEMD',
			icon: ClipboardListAlt
		},
		{
			href: '/app/tableau-synthese',
			label: 'Tableau Synthèse',
			icon: Grid3x3
		},
		{
			href: '/app/cerfa',
			label: 'Cerfa',
			icon: FolderOpen
		}
	];

	// Filtrer les liens selon le rôle de l'utilisateur
	const navLinks = $derived(allNavLinks.filter((link) => !link.adminOnly || isAdmin));

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
				{@const IconComponent = link.icon}
				<a
					href={link.href}
					class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors {isActive(link.href)
						? 'bg-emerald-600 text-white shadow-md'
						: 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}"
				>
					<IconComponent class="h-5 w-5" />
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
				<LogOut class="h-5 w-5" />
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
