<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import { fade, scale } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	// Props from server
	export let data;

	// Types
	type User = {
		id: string;
		email: string;
		name: string;
		role?: string;
		banned: boolean;
		image?: string;
		createdAt: Date;
		emailVerified: boolean;
		projetIds?: string[];
	};

	type Projet = {
		id: string;
		libelle: string;
		reference: string;
	};

	// State
	let users: User[] = [];
	let loading = true;
	let error: string | null = null;

	// Projets from server
	$: projets = (data.projets || []) as Projet[];
	$: usersWithProjets = (data.usersWithProjets || []) as { userId: string; projetId: string }[];

	// Pagination & Search
	let query = '';
	let perPage = 25;
	let page = 1;

	// Modals State
	let isEditModalOpen = false;
	let isCreateModalOpen = false;
	let isPasswordModalOpen = false;
	let isBanModalOpen = false;
	let isDeleteModalOpen = false;
	let isProjetsModalOpen = false;

	// Toast/Notification
	let toast: { message: string; type: 'success' | 'error' } | null = null;

	// Clôture de compte (formulaire)
	let banReason = '';

	// Active User for actions
	let selectedUser: User | null = null;

	// Show toast
	function showToast(message: string, type: 'success' | 'error' = 'success') {
		toast = { message, type };
		setTimeout(() => (toast = null), 3000);
	}

	// Forms
	let editForm = {
		name: '',
		email: '',
		role: 'user'
	};

	let createForm = {
		email: '',
		password: '',
		name: '',
		role: 'user',
		projetIds: [] as string[]
	};

	let passwordForm = {
		newPassword: ''
	};

	let projetsForm = {
		projetIds: [] as string[]
	};

	// Search filters for project selection
	let createProjectSearch = '';
	let modalProjectSearch = '';

	// Get user's projets
	function getUserProjets(userId: string): string[] {
		return usersWithProjets.filter((up) => up.userId === userId).map((up) => up.projetId);
	}

	// Get projets names
	function getProjetsNames(projetIds: string[]): string {
		if (!projetIds || projetIds.length === 0) return 'Aucun';
		const names = projetIds.map((id) => {
			const p = projets.find((proj) => proj.id === id);
			return p?.libelle || 'Inconnu';
		});
		if (names.length <= 2) return names.join(', ');
		return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
	}

	// Filter projects based on search
	$: filteredCreateProjets = projets.filter((p) => {
		if (!createProjectSearch) return true;
		const search = createProjectSearch.toLowerCase();
		return p.libelle.toLowerCase().includes(search) || p.reference.toLowerCase().includes(search);
	});

	$: filteredModalProjets = projets.filter((p) => {
		if (!modalProjectSearch) return true;
		const search = modalProjectSearch.toLowerCase();
		return p.libelle.toLowerCase().includes(search) || p.reference.toLowerCase().includes(search);
	});

	// Get projets count
	function getProjetsCount(userId: string): number {
		return getUserProjets(userId).length;
	}

	async function loadUsers() {
		loading = true;
		error = null;
		try {
			// @ts-ignore
			const res = await authClient.admin.listUsers({
				query: {
					limit: 100,
					sortBy: 'createdAt',
					sortDirection: 'desc'
				}
			});

			if (res.data) {
				users = (res.data.users as unknown as User[]).map((u) => ({
					...u,
					projetIds: getUserProjets(u.id)
				}));
			} else {
				if (res.error) error = res.error.message || 'Une erreur est survenue';
			}
		} catch (e: any) {
			error = e.message || 'Échec du chargement des utilisateurs';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	// Close modals on Escape
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (isProjetsModalOpen) closeProjetsModal();
			else if (isCreateModalOpen) closeCreateModal();
			else if (isEditModalOpen) closeEditModal();
			else if (isPasswordModalOpen) closePasswordModal();
			else if (isBanModalOpen) closeBanModal();
			else if (isDeleteModalOpen) closeDeleteModal();
		}
	}

	onMount(() => {
		loadUsers();
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// Derived
	$: filteredUsers = users.filter((u) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
	});

	$: totalPages = Math.ceil(filteredUsers.length / perPage);
	$: displayedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

	// --- Actions ---

	// PROJETS MODAL
	function openProjetsModal(user: User) {
		selectedUser = user;
		projetsForm.projetIds = getUserProjets(user.id);
		modalProjectSearch = '';
		isProjetsModalOpen = true;
	}

	function closeProjetsModal() {
		isProjetsModalOpen = false;
		selectedUser = null;
	}

	// EDIT USER INFO
	function openEditModal(user: User) {
		selectedUser = user;
		editForm.name = user.name || '';
		editForm.email = user.email || '';
		editForm.role = user.role || 'user';
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		selectedUser = null;
	}

	async function saveUserInfo() {
		if (!selectedUser) return;
		try {
			const res = await authClient.admin.setRole({
				userId: selectedUser.id,
				userId: selectedUser.id,
				role: editForm.role as 'user' | 'admin' | 'collaborateur'
			});
			if (res.error) {
				showToast('Échec de la mise à jour : ' + res.error.message, 'error');
				return;
			}
			users = users.map((u) =>
				u.id === selectedUser?.id
					? { ...u, name: editForm.name, email: editForm.email, role: editForm.role }
					: u
			);
			closeEditModal();
			showToast('Utilisateur mis à jour avec succès');
		} catch (e: any) {
			showToast('Échec de la mise à jour', 'error');
		}
	}

	// CREATE USER
	function openCreateModal() {
		createForm = { email: '', password: '', name: '', role: 'user', projetIds: [] };
		createProjectSearch = '';
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
	}

	async function createUser() {
		try {
			const res = await authClient.admin.createUser({
				email: createForm.email,
				password: createForm.password,
				name: createForm.name,
				password: createForm.password,
				name: createForm.name,
				role: createForm.role as 'user' | 'admin' | 'collaborateur'
			});

			if (res.data) {
				const newUserId = res.data.user.id;

				// Assigner les projets si sélectionnés
				if (createForm.projetIds.length > 0) {
					const formData = new FormData();
					formData.append('userId', newUserId);
					createForm.projetIds.forEach((id) => formData.append('projetIds', id));

					await fetch('?/setProjets', {
						method: 'POST',
						body: formData
					});
				}

				// Recharger les données du serveur pour obtenir les associations mises à jour
				await invalidateAll();
				// Recharger les utilisateurs pour afficher le nouvel utilisateur
				await loadUsers();
				closeCreateModal();
				showToast('Utilisateur créé avec succès');
			} else if (res.error) {
				showToast('Échec de la création : ' + res.error.message, 'error');
			}
		} catch (e) {
			showToast("Échec de la création de l'utilisateur", 'error');
		}
	}

	// CLÔTURE / RÉACTIVATION DE COMPTE
	function openBanModal(user: User) {
		selectedUser = user;
		banReason = '';
		isBanModalOpen = true;
	}

	function closeBanModal() {
		isBanModalOpen = false;
		selectedUser = null;
		banReason = '';
	}

	async function confirmBan() {
		if (!selectedUser) return;
		const wasBanned = selectedUser.banned;
		try {
			if (wasBanned) {
				const res = await authClient.admin.unbanUser({ userId: selectedUser.id });
				if (res.error) {
					showToast('Échec de la réactivation : ' + res.error.message, 'error');
					return;
				}
				users = users.map((u) => (u.id === selectedUser!.id ? { ...u, banned: false } : u));
				showToast('Compte réactivé avec succès');
			} else {
				const res = await authClient.admin.banUser({
					userId: selectedUser.id,
					banReason: banReason || 'Action administrative'
				});
				if (res.error) {
					showToast('Échec de la clôture : ' + res.error.message, 'error');
					return;
				}
				users = users.map((u) => (u.id === selectedUser!.id ? { ...u, banned: true } : u));
				showToast('Compte clôturé avec succès');
			}
			closeBanModal();
		} catch (e) {
			showToast(
				wasBanned ? 'Échec de la réactivation du compte' : 'Échec de la clôture du compte',
				'error'
			);
		}
	}

	// DELETE USER
	function openDeleteModal(user: User) {
		selectedUser = user;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		selectedUser = null;
	}

	async function confirmDelete() {
		if (!selectedUser) return;
		try {
			const res = await authClient.admin.removeUser({
				userId: selectedUser.id
			});
			if (res.error) {
				showToast('Échec de la suppression : ' + res.error.message, 'error');
				return;
			}
			users = users.filter((u) => u.id !== selectedUser!.id);
			closeDeleteModal();
			showToast('Utilisateur supprimé avec succès');
		} catch (e) {
			showToast('Échec de la suppression', 'error');
		}
	}

	// SET PASSWORD
	function openPasswordModal(user: User) {
		selectedUser = user;
		passwordForm.newPassword = '';
		isPasswordModalOpen = true;
	}

	function closePasswordModal() {
		isPasswordModalOpen = false;
		selectedUser = null;
	}

	async function setPassword() {
		if (!selectedUser) return;
		try {
			const res = await authClient.admin.setUserPassword({
				userId: selectedUser.id,
				newPassword: passwordForm.newPassword
			});
			if (res.error) {
				showToast('Échec de la mise à jour du mot de passe : ' + res.error.message, 'error');
				return;
			}
			closePasswordModal();
			showToast('Mot de passe mis à jour avec succès');
		} catch (e) {
			showToast('Échec de la mise à jour du mot de passe', 'error');
		}
	}

	// CSV Export
	function downloadCSV() {
		if (!users.length) return;
		const cols = ['id', 'nom', 'email', 'role', 'cloture', 'date_creation'];
		const lines = [cols.join(',')];

		for (const u of filteredUsers) {
			const row = [
				u.id,
				`"${(u.name || '').replace(/"/g, '""')}"`,
				`"${(u.email || '').replace(/"/g, '""')}"`,
				u.role || 'user',
				u.banned ? 'oui' : 'non',
				u.createdAt
			];
			lines.push(row.join(','));
		}

		const csv = lines.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'utilisateurs_export.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	// Format date
	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Admin · Utilisateurs</title>
</svelte:head>

<main class="mx-auto max-w-7xl">
	<!-- Header -->
	<div class="mb-8">
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
					Gestion des utilisateurs
				</h1>
				<p class="mt-2 text-sm text-slate-600">
					Gérez les utilisateurs, leurs rôles et leurs accès.
				</p>
			</div>
			<div class="mt-4 flex flex-wrap gap-3 sm:mt-0">
				<button
					on:click={openCreateModal}
					class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
							cx="9"
							cy="7"
							r="4"
						/><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
					</svg>
					Nouvel utilisateur
				</button>
				<button
					on:click={loadUsers}
					class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
					</svg>
					Actualiser
				</button>
			</div>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="mb-6">
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
				<svg class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<input
				type="text"
				bind:value={query}
				placeholder="Rechercher par nom ou email..."
				class="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
			/>
		</div>
	</div>

	<!-- Error State -->
	{#if error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
			<div class="flex items-start gap-3">
				<svg class="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<div>
					<h3 class="text-sm font-semibold text-red-800">Erreur de chargement</h3>
					<p class="mt-1 text-sm text-red-700">{error}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Users Grid -->
	<div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
		{#if loading}
			<div class="divide-y divide-slate-100">
				{#each Array(5) as _}
					<div class="flex items-center gap-4 p-4">
						<div class="h-12 w-12 rounded-full bg-slate-100 animate-pulse"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 w-32 rounded bg-slate-100 animate-pulse"></div>
							<div class="h-3 w-48 rounded bg-slate-100 animate-pulse"></div>
						</div>
						<div class="h-6 w-16 rounded-full bg-slate-100 animate-pulse"></div>
					</div>
				{/each}
			</div>
		{:else if displayedUsers.length === 0}
			<div class="flex flex-col items-center justify-center py-16 px-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-slate-300 mb-4"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path
						d="M22 21v-2a4 4 0 0 0-3-3.87"
					/><path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
				<p class="text-slate-500 font-medium">Aucun utilisateur trouvé</p>
				<p class="text-sm text-slate-400 mt-1">Essayez de modifier vos critères de recherche</p>
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each displayedUsers as user (user.id)}
					<div class="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50">
						<!-- Avatar -->
						<div class="shrink-0">
							{#if user.image}
								<img
									class="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
									src={user.image}
									alt={user.name}
								/>
							{:else}
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-bold text-lg shadow"
								>
									{user.name?.[0]?.toUpperCase() || '?'}
								</div>
							{/if}
						</div>

						<!-- User Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<p class="truncate font-semibold text-slate-900">{user.name}</p>
								{#if user.role === 'admin'}
									<span
										class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700"
									>
										Admin
									</span>
								{:else if user.role === 'collaborateur'}
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
									>
										Collaborateur
									</span>
								{:else}
									<span
										class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
									>
										Utilisateur
									</span>
								{/if}
							</div>
							<p class="truncate text-sm text-slate-500">{user.email}</p>
						</div>

						<!-- Status -->
						<div class="hidden sm:flex sm:w-20 sm:justify-center">
							{#if user.banned}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
								>
									<span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
									Clôturé
								</span>
							{:else}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
								>
									<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
									Actif
								</span>
							{/if}
						</div>

						<!-- Date -->
						<div class="hidden md:flex md:flex-col md:items-end w-36 mr-4">
							<p class="text-xs text-slate-400">Inscrit le</p>
							<p class="text-sm font-medium text-slate-600 whitespace-nowrap">
								{formatDate(user.createdAt)}
							</p>
						</div>

						<!-- Projets -->
						<div class="hidden lg:flex lg:flex-col lg:items-end w-32 mr-4">
							<p class="text-xs text-slate-400">Projets</p>
							{#if user.role === 'admin'}
								<p
									class="text-sm font-medium text-slate-600 whitespace-nowrap truncate max-w-[120px]"
								>
									-
								</p>
							{:else}
								<p
									class="text-sm font-medium text-slate-600 whitespace-nowrap truncate max-w-[120px]"
									title={getProjetsNames(getUserProjets(user.id))}
								>
									{getProjetsCount(user.id)} projet{getProjetsCount(user.id) > 1 ? 's' : ''}
								</p>
							{/if}
						</div>

						<!-- Actions -->
						<div class="flex items-center gap-1 pl-2 border-l border-slate-200">
							<button
								on:click={() => openProjetsModal(user)}
								class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600"
								title="Gérer les projets"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
									/>
								</svg>
							</button>

							<button
								on:click={() => openEditModal(user)}
								class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
								title="Modifier les informations"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
										d="m15 5 4 4"
									/>
								</svg>
							</button>

							<button
								on:click={() => openPasswordModal(user)}
								class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
								title="Changer le mot de passe"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle
										cx="16.5"
										cy="7.5"
										r=".5"
										fill="currentColor"
									/>
								</svg>
							</button>

							<button
								on:click={() => openBanModal(user)}
								class="rounded-lg p-2 transition-colors {user.banned
									? 'text-green-500 hover:bg-green-50 hover:text-green-700'
									: 'text-slate-400 hover:bg-amber-50 hover:text-amber-600'}"
								title={user.banned ? 'Réactiver le compte' : 'Clôturer le compte'}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
								</svg>
							</button>

							<button
								on:click={() => openDeleteModal(user)}
								class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
								title="Supprimer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path
										d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
									/><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Pagination -->
		{#if !loading && filteredUsers.length > 0}
			<div
				class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3"
			>
				<p class="text-sm text-slate-600">
					Affichage de <span class="font-semibold"
						>{Math.min(filteredUsers.length, (page - 1) * perPage + 1)}</span
					>
					à <span class="font-semibold">{Math.min(filteredUsers.length, page * perPage)}</span>
					sur <span class="font-semibold">{filteredUsers.length}</span> résultats
				</p>
				<div class="flex gap-2">
					<button
						on:click={() => (page = Math.max(1, page - 1))}
						disabled={page === 1}
						class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
						Précédent
					</button>
					<button
						on:click={() => (page = Math.min(totalPages, page + 1))}
						disabled={page === totalPages}
						class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Suivant
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</div>
			</div>
		{/if}
	</div>
</main>

<!-- MODAL : Créer un utilisateur -->
{#if isCreateModalOpen}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closeCreateModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<div class="px-6 py-5">
						<div class="flex items-center gap-3 mb-6">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-emerald-600"
								>
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
										cx="9"
										cy="7"
										r="4"
									/><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-slate-900">Créer un utilisateur</h3>
						</div>
						<div class="space-y-4">
							<div>
								<label for="create-name" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Nom</label
								>
								<input
									id="create-name"
									bind:value={createForm.name}
									type="text"
									placeholder="Jean Dupont"
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								/>
							</div>
							<div>
								<label for="create-email" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Email</label
								>
								<input
									id="create-email"
									bind:value={createForm.email}
									type="email"
									placeholder="jean.dupont@exemple.com"
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								/>
							</div>
							<div>
								<label for="create-password" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Mot de passe</label
								>
								<input
									id="create-password"
									bind:value={createForm.password}
									type="password"
									autocomplete="new-password"
									placeholder="••••••••"
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								/>
							</div>
							<div>
								<label for="create-role" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Rôle</label
								>
								<select
									id="create-role"
									bind:value={createForm.role}
									class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								>
									<option value="user">Utilisateur</option>
									<option value="admin">Administrateur</option>
									<option value="collaborateur">Collaborateur</option>
								</select>
							</div>
							<div>
								<label for="create-projets" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Projets</label
								>
								<!-- Search bar for projects -->
								<div class="relative mb-2">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<input
										type="text"
										bind:value={createProjectSearch}
										placeholder="Rechercher un projet..."
										class="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
									/>
								</div>
								<div
									class="max-h-40 overflow-y-auto rounded-lg border border-slate-300 bg-white p-2"
								>
									{#if projets.length === 0}
										<p class="text-sm text-slate-500 py-2 px-2">Aucun projet disponible</p>
									{:else if filteredCreateProjets.length === 0}
										<p class="text-sm text-slate-500 py-2 px-2">Aucun projet trouvé</p>
									{:else}
										{#each filteredCreateProjets as p}
											<label
												class="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-50 cursor-pointer"
											>
												<input
													type="checkbox"
													value={p.id}
													checked={createForm.projetIds.includes(p.id)}
													on:change={(e) => {
														if (e.currentTarget.checked) {
															createForm.projetIds = [...createForm.projetIds, p.id];
														} else {
															createForm.projetIds = createForm.projetIds.filter(
																(id) => id !== p.id
															);
														}
													}}
													class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
												/>
												<span class="text-sm text-slate-700"
													>{p.libelle} <span class="text-slate-400">({p.reference})</span></span
												>
											</label>
										{/each}
									{/if}
								</div>
								{#if createForm.projetIds.length > 0}
									<p class="text-xs text-slate-500 mt-1">
										{createForm.projetIds.length} projet(s) sélectionné(s)
									</p>
								{/if}
							</div>
						</div>
					</div>
					<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						<button
							type="button"
							class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							on:click={closeCreateModal}
						>
							Annuler
						</button>
						<button
							type="button"
							class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
							on:click={createUser}
						>
							Créer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL : Modifier les informations -->
{#if isEditModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closeEditModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<div class="px-6 py-5">
						<div class="flex items-center gap-3 mb-6">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-blue-600"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
										d="m15 5 4 4"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">Modifier l'utilisateur</h3>
								<p class="text-sm text-slate-500">{selectedUser.email}</p>
							</div>
						</div>
						<div class="space-y-4">
							<div>
								<label for="edit-name" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Nom</label
								>
								<input
									id="edit-name"
									bind:value={editForm.name}
									type="text"
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								/>
							</div>
							<div>
								<label for="edit-email" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Email</label
								>
								<input
									id="edit-email"
									bind:value={editForm.email}
									type="email"
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								/>
							</div>
							<div>
								<label for="edit-role" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Rôle</label
								>
								<select
									id="edit-role"
									bind:value={editForm.role}
									class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								>
									<option value="user">Utilisateur</option>
									<option value="admin">Administrateur</option>
									<option value="collaborateur">Collaborateur</option>
								</select>
							</div>
						</div>
					</div>
					<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						<button
							type="button"
							class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							on:click={closeEditModal}
						>
							Annuler
						</button>
						<button
							type="button"
							class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
							on:click={saveUserInfo}
						>
							Enregistrer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL : Changer le mot de passe -->
{#if isPasswordModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closePasswordModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<div class="px-6 py-5">
						<div class="flex items-center gap-3 mb-6">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-amber-600"
								>
									<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle
										cx="16.5"
										cy="7.5"
										r=".5"
										fill="currentColor"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">Changer le mot de passe</h3>
								<p class="text-sm text-slate-500">{selectedUser.name}</p>
							</div>
						</div>
						<div>
							<label for="new-password" class="block text-sm font-medium text-slate-700 mb-1.5"
								>Nouveau mot de passe</label
							>
							<input
								id="new-password"
								bind:value={passwordForm.newPassword}
								type="password"
								autocomplete="new-password"
								placeholder="Entrez le nouveau mot de passe"
								class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							/>
							<p class="mt-2 text-xs text-slate-500">
								Le mot de passe doit contenir au moins 8 caractères.
							</p>
						</div>
					</div>
					<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						<button
							type="button"
							class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							on:click={closePasswordModal}
						>
							Annuler
						</button>
						<button
							type="button"
							class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
							on:click={setPassword}
						>
							Mettre à jour
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL : Clôture / Réactivation de compte -->
{#if isBanModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closeBanModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<div class="px-6 py-5">
						<div class="flex items-center gap-3 mb-6">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full {selectedUser.banned
									? 'bg-green-100'
									: 'bg-amber-100'}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class={selectedUser.banned ? 'text-green-600' : 'text-amber-600'}
								>
									<circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">
									{selectedUser.banned ? 'Réactiver le compte' : 'Clôturer le compte'}
								</h3>
								<p class="text-sm text-slate-500">{selectedUser.name}</p>
							</div>
						</div>
						{#if selectedUser.banned}
							<p class="text-sm text-slate-600">
								Êtes-vous sûr de vouloir réactiver ce compte ? Il pourra à nouveau accéder à la
								plateforme.
							</p>
						{:else}
							<div>
								<label for="ban-reason" class="block text-sm font-medium text-slate-700 mb-1.5"
									>Raison de la clôture (optionnel)</label
								>
								<textarea
									id="ban-reason"
									bind:value={banReason}
									rows="3"
									placeholder="Ex: Violation des conditions d'utilisation..."
									class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
								></textarea>
							</div>
						{/if}
					</div>
					<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						<button
							type="button"
							class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							on:click={closeBanModal}
						>
							Annuler
						</button>
						<button
							type="button"
							class="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors {selectedUser.banned
								? 'bg-green-600 hover:bg-green-700'
								: 'bg-amber-600 hover:bg-amber-700'}"
							on:click={confirmBan}
						>
							{selectedUser.banned ? 'Réactiver' : 'Clôturer'}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL : Supprimer -->
{#if isDeleteModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closeDeleteModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<div class="px-6 py-5">
						<div class="flex items-center gap-3 mb-6">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-red-600"
								>
									<path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path
										d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
									/><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold text-slate-900">Supprimer l'utilisateur</h3>
								<p class="text-sm text-slate-500">{selectedUser.name}</p>
							</div>
						</div>
						<div class="rounded-lg bg-red-50 border border-red-200 p-4">
							<p class="text-sm text-red-800">
								<strong>Attention :</strong> Cette action est irréversible. Toutes les données associées
								à cet utilisateur seront définitivement supprimées.
							</p>
						</div>
					</div>
					<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						<button
							type="button"
							class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							on:click={closeDeleteModal}
						>
							Annuler
						</button>
						<button
							type="button"
							class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
							on:click={confirmDelete}
						>
							Supprimer définitivement
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL : Gérer les projets -->
{#if isProjetsModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<button
			type="button"
			aria-label="Fermer la modale"
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			transition:fade
			on:click={closeProjetsModal}
		></button>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
					transition:scale
				>
					<form
						method="POST"
						action="?/setProjets"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									// Invalider les données du serveur pour les recharger
									await invalidateAll();

									// Mettre à jour usersWithProjets localement
									// D'abord retirer toutes les associations pour cet utilisateur
									usersWithProjets = usersWithProjets.filter(
										(up) => up.userId !== selectedUser?.id
									);
									// Puis ajouter les nouvelles
									const newAssocs = projetsForm.projetIds.map((projetId) => ({
										userId: selectedUser!.id,
										projetId
									}));
									usersWithProjets = [...usersWithProjets, ...newAssocs];

									// Mettre à jour aussi le tableau users
									users = users.map((u) =>
										u.id === selectedUser?.id ? { ...u, projetIds: projetsForm.projetIds } : u
									);

									closeProjetsModal();
									showToast('Projets mis à jour avec succès');
								} else {
									showToast('Échec de la mise à jour', 'error');
								}
							};
						}}
					>
						<input type="hidden" name="userId" value={selectedUser.id} />
						<div class="px-6 py-5">
							<div class="flex items-center gap-3 mb-6">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-indigo-600"
									>
										<path
											d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
										/>
									</svg>
								</div>
								<div>
									<h3 class="text-lg font-semibold text-slate-900">Gérer les projets</h3>
									<p class="text-sm text-slate-500">{selectedUser.name}</p>
								</div>
							</div>
							<div>
								<div class="block text-sm font-medium text-slate-700 mb-1.5">Projets assignés</div>
								<!-- Search bar for projects -->
								<div class="relative mb-2">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<input
										type="text"
										bind:value={modalProjectSearch}
										placeholder="Rechercher un projet..."
										class="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
									/>
								</div>
								<div
									class="max-h-64 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100"
								>
									{#if projets.length === 0}
										<p class="p-4 text-sm text-slate-500 text-center">Aucun projet disponible</p>
									{:else if filteredModalProjets.length === 0}
										<p class="p-4 text-sm text-slate-500 text-center">Aucun projet trouvé</p>
									{:else}
										{#each filteredModalProjets as p}
											<label class="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
												<input
													type="checkbox"
													name="projetIds"
													value={p.id}
													checked={projetsForm.projetIds.includes(p.id)}
													on:change={(e) => {
														if (e.currentTarget.checked) {
															projetsForm.projetIds = [...projetsForm.projetIds, p.id];
														} else {
															projetsForm.projetIds = projetsForm.projetIds.filter(
																(id) => id !== p.id
															);
														}
													}}
													class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
												/>
												<div class="flex-1 min-w-0">
													<p class="text-sm font-medium text-slate-900 truncate">{p.libelle}</p>
													<p class="text-xs text-slate-500 truncate">Réf: {p.reference}</p>
												</div>
											</label>
										{/each}
									{/if}
								</div>
								<p class="mt-2 text-xs text-slate-500">
									{projetsForm.projetIds.length} projet{projetsForm.projetIds.length > 1 ? 's' : ''} sélectionné{projetsForm
										.projetIds.length > 1
										? 's'
										: ''}
								</p>
							</div>
						</div>
						<div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
							<button
								type="button"
								class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
								on:click={closeProjetsModal}
							>
								Annuler
							</button>
							<button
								type="submit"
								class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
							>
								Enregistrer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- TOAST NOTIFICATION -->
{#if toast}
	<div class="fixed bottom-4 right-4 z-50" transition:scale={{ duration: 200 }}>
		<div
			class="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg {toast.type === 'success'
				? 'bg-emerald-600'
				: 'bg-red-600'} text-white"
		>
			{#if toast.type === 'success'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line
						x1="9"
						x2="15"
						y1="9"
						y2="15"
					/>
				</svg>
			{/if}
			<span class="text-sm font-medium">{toast.message}</span>
		</div>
	</div>
{/if}
