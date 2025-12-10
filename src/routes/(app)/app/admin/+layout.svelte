<script lang="ts">
	import { page } from '$app/stores';
	import {
		LayoutDashboard,
		Building2,
		Store,
		FolderKanban,
		Users,
		Layers,
		Tags,
		Box,
		Leaf
	} from 'lucide-svelte';

	let { children } = $props();

	const navigation = [
		{ name: 'Tableau de bord', href: '/app/admin', icon: LayoutDashboard },
		{ section: 'Organisation' },
		{ name: 'Sociétés', href: '/app/admin/societes', icon: Building2 },
		{ name: 'Etablissements', href: '/app/admin/etablissements', icon: Store },
		{ name: 'Projets', href: '/app/admin/projets', icon: FolderKanban },
		{ name: 'Utilisateurs', href: '/app/admin/utilisateurs', icon: Users },
		{ section: 'Configuration' },
		{ name: 'Macro-catégories', href: '/app/admin/macro-categories', icon: Layers },
		{ name: 'Catégories', href: '/app/admin/categories', icon: Tags },
		{ name: 'Objets', href: '/app/admin/objets', icon: Box },
		{ name: 'Nature', href: '/app/admin/nature', icon: Leaf }
	];
</script>

<div class="flex h-full min-h-[calc(100vh-2rem)] gap-6 font-[Poppins]">
	<!-- Secondary Sidebar for Admin -->
	<aside class="w-64 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="p-4 border-b border-gray-100">
			<h2 class="text-lg font-semibold text-gray-900">Administration</h2>
			<p class="text-xs text-gray-500">Gestion de la base de données</p>
		</div>
		<nav class="p-2 space-y-1">
			{#each navigation as item}
				{#if item.section}
					<div class="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
						{item.section}
					</div>
				{:else}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                        {$page.url.pathname === item.href 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
					>
						<item.icon class="h-4 w-4" />
						{item.name}
					</a>
				{/if}
			{/each}
		</nav>
	</aside>

	<!-- Main Admin Content -->
	<main class="flex-1 min-w-0">
		{@render children()}
	</main>
</div>
