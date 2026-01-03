<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
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
		ShieldUser,
		TestTube2,
		ChevronDown,
		ChevronRight,
		Settings,
		Files
	} from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let { children, data } = $props();

	// Récupérer les données de session
	const session = authClient.useSession();

	// Récupérer isAdmin depuis les données du serveur avec $derived
	const isAdmin = $derived(data.isAdmin);

	// Sidebar state
	let sidebarOpen = $state(false);

	// Type definition for navigation links
	type NavLink = {
		href?: string;
		label: string;
		icon: any;
		adminOnly?: boolean;
		subItems?: Array<{
			href: string;
			label: string;
			icon: any;
			adminOnly?: boolean;
		}>;
	};

	// Configuration centralisée des liens de navigation
	const allNavLinks: NavLink[] = [
		{
			href: '/app/dashboard',
			label: 'Mes projets',
			icon: Menu
		},
		{
			label: 'Administration',
			icon: Settings,
			adminOnly: true,
			subItems: [
				{
					href: '/app/admin',
					label: 'Administration DB',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/admin-db',
					label: 'Utilisateurs',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/admin/societes',
					label: 'Sociétés',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/admin/etablissements',
					label: 'Etablissements',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/macro-categories',
					label: 'Paramètres',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/categories',
					label: 'Paramètres',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/objets',
					label: 'Objets',
					icon: null,
					adminOnly: true
				},
				{
					href: '/app/nature',
					label: 'Nature',
					icon: null,
					adminOnly: true
				}
			]
		},
		{
			label: 'Inventaires',
			icon: Files,
			subItems: [
				{
					href: '/app/inventaire-risques',
					label: 'Inventaire risques',
					icon: ClipboardList
				},
				{
					href: '/app/inventaire-pemd',
					label: 'Inventaire PEMD',
					icon: ClipboardListAlt
				}
			]
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
		},
		{
			href: '/app/test',
			label: 'Test',
			icon: TestTube2
		}
	];

	// State for expanded submenus
	let expandedMenus = $state<Record<string, boolean>>({
		'Administration': true,
		'Inventaires': true
	});

	function toggleMenu(label: string) {
		expandedMenus[label] = !expandedMenus[label];
	}

	// Filtrer les liens selon le rôle de l'utilisateur
	const navLinks = $derived(allNavLinks.filter((link) => {
		if (link.adminOnly && !isAdmin) return false;
		// If it has subItems, check if at least one visible subItem exists
		if (link.subItems) {
			const visibleSubItems = link.subItems.filter(sub => !sub.adminOnly || isAdmin);
			return visibleSubItems.length > 0;
		}
		return true;
	}));

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
	<!-- Mobile Sidebar Overlay -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
			onclick={() => sidebarOpen = false}
			transition:fade={{ duration: 200 }}
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<!-- Logo -->
		<div class="flex h-20 shrink-0 items-center justify-center border-b border-gray-200 px-4">
			<img src={logoPEMD} alt="PEMD 360" class="h-16 w-auto object-contain" />
		</div>

		<!-- Navigation - scrollable -->
		<nav class="flex-1 space-y-1 overflow-y-auto p-4 custom-scrollbar">
			{#each navLinks as link}
				{@const IconComponent = link.icon}
				
				{#if link.subItems && link.subItems.length > 0}
					<div class="rounded-lg overflow-hidden">
						<button
							class="flex w-full items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
							onclick={() => toggleMenu(link.label)}
						>
							<div class="flex items-center gap-3">
								<IconComponent class="h-5 w-5" />
								<span class="font-medium">{link.label}</span>
							</div>
							{#if expandedMenus[link.label]}
								<ChevronDown class="h-4 w-4" />
							{:else}
								<ChevronRight class="h-4 w-4" />
							{/if}
						</button>
						
						{#if expandedMenus[link.label]}
							<div class="bg-gray-50 space-y-1 py-1" transition:slide={{ duration: 200 }}>
								{#each link.subItems as subLink}
									{@const SubIconComponent = subLink.icon}
									{#if !subLink.adminOnly || isAdmin}
										<a
											href={subLink.href}
											class="flex items-center gap-3 pl-11 pr-4 py-2 text-sm transition-colors {isActive(subLink.href)
												? 'text-emerald-600 font-medium'
												: 'text-gray-600 hover:text-emerald-600'}"
											onclick={() => {
												if (window.innerWidth < 1024) sidebarOpen = false;
											}}
										>
											<SubIconComponent class="h-4 w-4" />
											<span>{subLink.label}</span>
										</a>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<a
						href={link.href}
						class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors {isActive(link.href!)
							? 'bg-emerald-600 text-white shadow-md'
							: 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}"
						onclick={() => {
							if (window.innerWidth < 1024) sidebarOpen = false;
						}}
					>
						<IconComponent class="h-5 w-5" />
						<span class="font-medium">{link.label}</span>
					</a>
				{/if}
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

			<button onclick={handleLogout} class="btn btn-error btn-ghost w-full justify-start gap-3">
				<LogOut class="h-5 w-5" />Déconnexion
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto min-w-0 w-full relative">
		<!-- Mobile Header for Hamburger -->
		<div class="sticky top-0 z-30 flex items-center border-b border-gray-200 bg-white px-4 py-2 lg:hidden">
			<button 
				class="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
				onclick={() => sidebarOpen = !sidebarOpen}
			>
				<Menu class="h-6 w-6" />
			</button>
			<span class="ml-3 font-semibold text-gray-900">Menu</span>
		</div>

		<!-- Page Content -->
		<div class="p-4 lg:p-6">
			{@render children()}
		</div>
	</main>
</div>
