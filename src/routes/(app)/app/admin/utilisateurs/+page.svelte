<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import { fade, scale } from 'svelte/transition';

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
	};

	// State
	let users: User[] = [];
	let loading = true;
	let error: string | null = null;

	// Pagination & Search
	let query = '';
	let perPage = 25;
	let page = 1;

	// Modals State
	let isEditModalOpen = false;
	let isCreateModalOpen = false;
	let isPasswordModalOpen = false;

	// Active User for actions
	let selectedUser: User | null = null;

	// Forms
	let editForm = {
		role: 'user'
	};

	let createForm = {
		email: '',
		password: '',
		name: '',
		role: 'user'
	};

	let passwordForm = {
		newPassword: ''
	};

	async function loadUsers() {
		loading = true;
		error = null;
		try {
			// @ts-ignore
			const res = await authClient.admin.listUsers({
				query: {
					limit: 100, // Fetch up to 100
					sortBy: 'createdAt',
					sortDirection: 'desc'
				}
			});

			if (res.data) {
				users = res.data.users as unknown as User[];
			} else {
				if (res.error) error = res.error.message;
			}
		} catch (e: any) {
			error = e.message || 'Failed to load users';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadUsers();
	});

	// Derived
	$: filteredUsers = users.filter((u) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return (
			u.name?.toLowerCase().includes(q) ||
			u.email?.toLowerCase().includes(q) ||
			u.id.toLowerCase().includes(q)
		);
	});

	$: totalPages = Math.ceil(filteredUsers.length / perPage);
	$: displayedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

	// --- Actions ---

	// EDIT ROLE
	function openEditModal(user: User) {
		selectedUser = user;
		editForm.role = user.role || 'user';
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		selectedUser = null;
	}

	async function saveRole() {
		if (!selectedUser) return;
		try {
			await authClient.admin.setRole({
				userId: selectedUser.id,
				role: editForm.role
			});
			users = users.map((u) => (u.id === selectedUser?.id ? { ...u, role: editForm.role } : u));
			closeEditModal();
		} catch (e) {
			alert('Failed to update role: ' + e.message);
		}
	}

	// CREATE USER
	function openCreateModal() {
		createForm = { email: '', password: '', name: '', role: 'user' };
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
				role: createForm.role
			});

			if (res.data) {
				// Refresh list or add to local state if structure matches
				// Better just refresh to be safe and simple
				await loadUsers();
				closeCreateModal();
			} else if (res.error) {
				alert('Failed to create user: ' + res.error.message);
			}
		} catch (e) {
			alert('Failed to create user');
		}
	}

	// BAN / UNBAN
	async function toggleBan(user: User) {
		if (user.banned) {
			if (!confirm(`Unban ${user.name}?`)) return;
			try {
				await authClient.admin.unbanUser({ userId: user.id });
				users = users.map((u) => (u.id === user.id ? { ...u, banned: false } : u));
			} catch (e) {
				alert('Failed to unban user');
			}
		} else {
			const reason = prompt('Enter ban reason (optional):', 'Admin action');
			if (reason === null) return; // Cancelled
			try {
				await authClient.admin.banUser({
					userId: user.id,
					banReason: reason
				});
				users = users.map((u) => (u.id === user.id ? { ...u, banned: true } : u));
			} catch (e) {
				alert('Failed to ban user');
			}
		}
	}

	// IMPERSONATE
	async function impersonate(user: User) {
		if (!confirm(`Are you sure you want to impersonate ${user.name}?`)) return;
		try {
			await authClient.admin.impersonateUser({
				userId: user.id
			});
			// Usually this sets a cookie and redirects.
			// BetterAuth client handles the redirect? Doc says "creates a session".
			// We might need to reload or redirect manually if it doesn't happen auto.
			window.location.href = '/'; // Go to home as that user
		} catch (e) {
			alert('Failed to impersonate user');
		}
	}

	// DELETE USER
	async function deleteUser(user: User) {
		if (
			!confirm(
				`DANGER: Are you sure you want to PERMANENTLY DELETE ${user.name}? This cannot be undone.`
			)
		)
			return;
		try {
			await authClient.admin.removeUser({
				userId: user.id
			});
			users = users.filter((u) => u.id !== user.id);
		} catch (e) {
			alert('Failed to delete user');
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
			await authClient.admin.setUserPassword({
				userId: selectedUser.id,
				newPassword: passwordForm.newPassword
			});
			alert('Password updated successfully');
			closePasswordModal();
		} catch (e) {
			alert('Failed to set password');
		}
	}

	// REVOKE ALL SESSIONS
	async function revokeSessions(user: User) {
		if (!confirm(`Revoke all sessions for ${user.name}? They will be logged out.`)) return;
		try {
			await authClient.admin.revokeUserSessions({
				userId: user.id
			});
			alert('Sessions revoked.');
		} catch (e) {
			alert('Failed to revoke sessions');
		}
	}

	// CSV Export
	function downloadCSV() {
		if (!users.length) return;
		const cols = ['id', 'name', 'email', 'role', 'banned', 'createdAt'];
		const lines = [cols.join(',')];

		for (const u of filteredUsers) {
			const row = [
				u.id,
				`"${(u.name || '').replace(/"/g, '""')}"`,
				`"${(u.email || '').replace(/"/g, '""')}"`,
				u.role || 'user',
				u.banned,
				u.createdAt
			];
			lines.push(row.join(','));
		}

		const csv = lines.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'users_export.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<svelte:head>
	<title>Admin · Users</title>
</svelte:head>

<main class="mx-auto max-w-7xl p-6">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
			<p class="mt-2 text-sm text-slate-500">Manage users, roles, and security.</p>
		</div>
		<div class="flex gap-3">
			<button
				on:click={openCreateModal}
				class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				+ Create User
			</button>
			<button
				on:click={loadUsers}
				class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				Refresh
			</button>
			<button
				on:click={downloadCSV}
				class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			>
				Export CSV
			</button>
		</div>
	</div>

	<!-- Filters -->
	<div
		class="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
	>
		<div class="relative flex-1 min-w-[300px]">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
				placeholder="Search by name, email, or ID..."
				class="block w-full rounded-md border-slate-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
			/>
		</div>
	</div>

	<!-- Error State -->
	{#if error}
		<div class="mb-6 rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error loading users</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Table -->
	<div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-slate-200">
				<thead class="bg-slate-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
							>User</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
							>Role</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
							>Status</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
							>Created</th
						>
						<th scope="col" class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 bg-white">
					{#if loading}
						{#each Array(5) as _}
							<tr>
								<td class="px-6 py-4"
									><div class="h-10 w-48 rounded bg-slate-100 animate-pulse"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-6 w-20 rounded bg-slate-100 animate-pulse"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-6 w-16 rounded bg-slate-100 animate-pulse"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-6 w-32 rounded bg-slate-100 animate-pulse"></div></td
								>
								<td class="px-6 py-4"></td>
							</tr>
						{/each}
					{:else if displayedUsers.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-slate-500"> No users found </td>
						</tr>
					{:else}
						{#each displayedUsers as user (user.id)}
							<tr class="hover:bg-slate-50 group">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="h-10 w-10 flex-shrink-0">
											{#if user.image}
												<img class="h-10 w-10 rounded-full object-cover" src={user.image} alt="" />
											{:else}
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold"
												>
													{user.name?.[0]?.toUpperCase() || '?'}
												</div>
											{/if}
										</div>
										<div class="ml-4">
											<div class="font-medium text-slate-900">{user.name}</div>
											<div class="text-sm text-slate-500">{user.email}</div>
											<!-- ID shown only on hover or tiny -->
											<div class="text-xs text-slate-400 font-mono hidden group-hover:block">
												{user.id}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<button
										on:click={() => openEditModal(user)}
										class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 border hover:bg-slate-200
										{user.role === 'admin'
											? 'bg-purple-100 text-purple-800 border-purple-200'
											: 'bg-slate-100 text-slate-800 border-slate-200'}"
										title="Click to change role"
									>
										{user.role || 'user'}
									</button>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if user.banned}
										<span
											class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800"
										>
											Banned
										</span>
									{:else}
										<span
											class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
										>
											Active
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
									{new Date(user.createdAt).toLocaleDateString()}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div
										class="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity"
									>
										<!-- More Actions Menu Concept (simplified to buttons for now for clarity) -->
										<button
											class="text-slate-600 hover:text-emerald-600"
											title="Impersonate"
											on:click={() => impersonate(user)}
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
												class="lucide lucide-venetian-mask"
												><path
													d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"
												/><path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" /><path
													d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z"
												/></svg
											>
										</button>

										<button
											class="text-slate-600 hover:text-blue-600"
											title="Set Password"
											on:click={() => openPasswordModal(user)}
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
												class="lucide lucide-key-round"
												><path
													d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"
												/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg
											>
										</button>

										<button
											class="text-slate-600 hover:text-orange-600"
											title="Revoke Sessions"
											on:click={() => revokeSessions(user)}
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
												class="lucide lucide-log-out"
												><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline
													points="16 17 21 12 16 7"
												/><line x1="21" x2="9" y1="12" y2="12" /></svg
											>
										</button>

										<div class="w-px h-4 bg-slate-300 mx-1"></div>

										<button
											on:click={() => toggleBan(user)}
											class={user.banned
												? 'text-green-600 hover:text-green-900'
												: 'text-amber-600 hover:text-amber-900'}
											title={user.banned ? 'Unban' : 'Ban'}
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
												class="lucide lucide-ban"
												><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg
											>
										</button>

										<button
											on:click={() => deleteUser(user)}
											class="text-red-600 hover:text-red-900"
											title="Delete User"
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
												class="lucide lucide-trash-2"
												><path d="M3 6h18" /><path
													d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
												/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line
													x1="10"
													x2="10"
													y1="11"
													y2="17"
												/><line x1="14" x2="14" y1="11" y2="17" /></svg
											>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div
			class="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
		>
			<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-slate-700">
						Showing <span class="font-medium"
							>{Math.min(filteredUsers.length, (page - 1) * perPage + 1)}</span
						>
						to <span class="font-medium">{Math.min(filteredUsers.length, page * perPage)}</span> of
						<span class="font-medium">{filteredUsers.length}</span> results
					</p>
				</div>
				<div>
					<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
						<button
							on:click={() => (page = Math.max(1, page - 1))}
							disabled={page === 1}
							class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
						>
							Previous
						</button>
						<button
							on:click={() => (page = Math.min(totalPages, page + 1))}
							disabled={page === totalPages}
							class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
						>
							Next
						</button>
					</nav>
				</div>
			</div>
		</div>
	</div>
</main>

<!-- CREATE USER MODAL -->
{#if isCreateModalOpen}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" transition:fade></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
					transition:scale
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<h3 class="text-lg font-semibold leading-6 text-slate-900 mb-4">Create New User</h3>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Name</label>
								<input
									bind:value={createForm.name}
									type="text"
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Email</label>
								<input
									bind:value={createForm.email}
									type="email"
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Password</label>
								<input
									bind:value={createForm.password}
									type="password"
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Role</label>
								<select
									bind:value={createForm.role}
									class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto"
							on:click={createUser}>Create</button
						>
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							on:click={closeCreateModal}>Cancel</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- EDIT ROLE MODAL -->
{#if isEditModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" transition:fade></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm"
					transition:scale
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<h3 class="text-base font-semibold leading-6 text-slate-900">Change Role</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500 mb-4">
								Select a new role for <span class="font-medium text-gray-900"
									>{selectedUser.name}</span
								>.
							</p>
							<select
								bind:value={editForm.role}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
							>
								<option value="user">User</option>
								<option value="admin">Admin</option>
							</select>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto"
							on:click={saveRole}>Save</button
						>
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							on:click={closeEditModal}>Cancel</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- PASSWORD MODAL -->
{#if isPasswordModalOpen && selectedUser}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" transition:fade></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm"
					transition:scale
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<h3 class="text-base font-semibold leading-6 text-slate-900">Set Password</h3>
						<div class="mt-4">
							<input
								bind:value={passwordForm.newPassword}
								type="text"
								placeholder="New Password"
								class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
							/>
							<p class="mt-2 text-xs text-gray-500">
								Enter a new secure password for {selectedUser.name}.
							</p>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto"
							on:click={setPassword}>Update Password</button
						>
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							on:click={closePasswordModal}>Cancel</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
