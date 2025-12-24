<script lang="ts">
	// The server load provides: { users_legacy: Array<Record<string, any>>, error?: string }
	// SvelteKit passes the load data via the `data` prop.
	export let data: {
		users_legacy?: Array<Record<string, any>>;
		error?: string;
	} = {};

	import { writable, derived } from 'svelte/store';

	// Defensive defaults
	const rows = writable<Array<Record<string, any>>>(data.users_legacy ?? []);

	// Simple client-side text filter
	const query = writable<string>('');

	const filtered = derived([rows, query], ([$rows, $query]) => {
		const q = ($query || '').trim().toLowerCase();
		if (!q) return $rows;
		return $rows.filter((r) => {
			// Search across all column values by stringifying them
			return Object.values(r).some((v) => {
				try {
					return String(v).toLowerCase().includes(q);
				} catch {
					return false;
				}
			});
		});
	});

	// Helper: get columns from first row
	let columns: string[] = [];
	if (data.users_legacy && data.users_legacy.length > 0) {
		columns = Object.keys(data.users_legacy[0]);
	}

	// Format cell values nicely
	function fmt(val: any) {
		if (val === null || val === undefined) return '';
		if (typeof val === 'object') {
			try {
				return JSON.stringify(val);
			} catch {
				return String(val);
			}
		}
		return String(val);
	}
</script>

<svelte:head>
	<title>Admin — users_legacy</title>
</svelte:head>

<main class="p-6 font-sans text-slate-900">
	<h1 class="text-xl font-semibold mb-3">users_legacy</h1>

	{#if data.error}
		<div class="bg-red-50 text-red-800 border border-red-200 px-4 py-2 rounded-md mb-4">
			<strong class="mr-1">Error:</strong>
			<span>{data.error}</span>
		</div>
	{/if}

	{#if (!data.users_legacy || data.users_legacy.length === 0) && !data.error}
		<div
			class="text-slate-700 bg-slate-50 border border-dashed border-slate-200 px-3 py-2 rounded-md mb-4"
		>
			No rows found in <code class="bg-slate-100 px-1 rounded text-sm">users_legacy</code>.
		</div>
	{/if}

	{#if data.users_legacy && data.users_legacy.length > 0}
		<div class="flex gap-4 items-center flex-wrap my-3">
			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Search:</span>
				<input
					class="border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300 min-w-[220px]"
					type="search"
					placeholder="Filter rows..."
					on:input={(e) => query.set((e.target as HTMLInputElement).value)}
					aria-label="Filter rows"
				/>
			</label>
			<div class="ml-auto text-sm text-slate-500">
				{data.users_legacy.length} total rows
			</div>
		</div>

		<div
			class="overflow-auto border border-slate-200 rounded-lg"
			role="region"
			aria-label="users legacy table"
		>
			<table class="w-full min-w-[700px] table-auto">
				<thead class="bg-slate-100/90 sticky top-0">
					<tr>
						{#each columns as col}
							<th class="text-left font-medium text-sm px-4 py-2 border-b border-slate-200"
								>{col}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each $filtered as row, i}
						<tr class={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
							{#each columns as col}
								<td
									class="px-4 py-2 text-sm border-b border-slate-100 align-top"
									title={fmt(row[col])}
								>
									{fmt(row[col])}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			{#if $filtered.length === 0}
				<div class="p-4 text-sm text-slate-600">No rows match your search.</div>
			{/if}
		</div>
	{/if}
</main>
