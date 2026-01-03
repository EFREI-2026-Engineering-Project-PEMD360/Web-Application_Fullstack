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
		{ section: 'Configuration' },
		{ name: 'Macro-catégories', href: '/app/admin/macro-categories', icon: Layers },
		{ name: 'Catégories', href: '/app/admin/categories', icon: Tags },
		{ name: 'Objets', href: '/app/admin/objets', icon: Box },
		{ name: 'Nature', href: '/app/admin/nature', icon: Leaf }
	];
</script>

<div class="flex h-full min-h-[calc(100vh-2rem)] gap-6 font-[Poppins]">


	<!-- Main Admin Content -->
	<main class="flex-1 min-w-0">
		{@render children()}
	</main>
</div>
