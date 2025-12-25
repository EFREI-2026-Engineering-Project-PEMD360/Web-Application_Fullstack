<script lang="ts">
	// Admin page to display the users_legacy table.
	// SvelteKit load provides `data` -> { users_legacy?: Array<Record<string, unknown>>, error?: string }
	export let data: {
		users_legacy?: Array<Record<string, unknown>>;
		error?: string;
	} = {};

	// Local state
	let rows: Array<Record<string, unknown>> = data.users_legacy ?? [];
	let query = '';
	let perPage = 25;
	let page = 1;

	// Derived reactive values
	$: columns = rows.length > 0 ? Object.keys(rows[0]) : [];
	$: filtered = rows.filter((r) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return Object.values(r).some((v) => {
			try {
				return String(v ?? '')
					.toLowerCase()
					.includes(q);
			} catch {
				return false;
			}
		});
	});
	$: total = filtered.length;
	$: totalPages = Math.max(1, Math.ceil(total / perPage));
	// Ensure page in range
	$: if (page > totalPages) page = totalPages;
	$: paged = filtered.slice((page - 1) * perPage, page * perPage);

	// Format values
	function fmt(v: unknown) {
		if (v === null || v === undefined) return '';
		if (typeof v === 'object') {
			try {
				return JSON.stringify(v);
			} catch {
				return String(v);
			}
		}
		return String(v);
	}

	// CSV export for the currently filtered rows
	function downloadCSV() {
		if (!rows || rows.length === 0) return;
		const cols = columns;
		const lines: string[] = [];
		// header
		lines.push(cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','));
		for (const r of filtered) {
			const row = cols.map((c) => {
				const v = r[c];
				const s = fmt(v).replace(/"/g, '""');
				return `"${s}"`;
			});
			lines.push(row.join(','));
		}
		const csv = lines.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'users_legacy.csv';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	// Helpers for pagination buttons
	function prevPage() {
		page = Math.max(1, page - 1);
	}
	function nextPage() {
		page = Math.min(totalPages, page + 1);
	}
</script>

<svelte:head>
	<title>Admin · users_legacy</title>
</svelte:head>

<main class="mx-auto max-w-7xl p-6">
	<div class="flex items-start gap-4">
		<div>
			<h1 class="text-2xl font-semibold text-slate-900">users_legacy</h1>
			<p class="text-sm text-slate-500">Admin view of legacy users table</p>
		</div>

		<div class="ml-auto flex items-center gap-3">
			<button
				type="button"
				on:click={downloadCSV}
				class="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
			>
				Export CSV
			</button>
		</div>
	</div>

	{#if data.error}
		<div class="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<strong class="block">Error</strong>
			<div class="mt-1 text-sm">{data.error}</div>
		</div>
	{/if}

	{#if rows.length === 0}
		<div
			class="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-700"
		>
			Zero rows found in <code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm"
				>users_legacy</code
			>
		</div>
	{/if}

	{#if !rows}
		<div
			class="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-700"
		>
			No rows found in <code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm"
				>users_legacy</code
			>
		</div>
	{/if}

	{#if data.error}
		<div
			class="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-700"
		>
			{data.error}
		</div>
	{/if}

	{#if rows && rows.length > 0}
		<div class="mt-6 flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Search</span>
				<input
					type="search"
					bind:value={query}
					placeholder="Filter rows..."
					class="ml-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
				/>
			</label>

			<div class="ml-auto flex items-center gap-3">
				<div class="text-sm text-slate-500">{total} rows</div>

				<label class="flex items-center gap-2 text-sm text-slate-600">
					Per page
					<select
						bind:value={perPage}
						class="ml-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
					>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
				</label>
			</div>
		</div>

		<div class="mt-4 overflow-auto rounded-lg border border-slate-200">
			<table class="w-full min-w-[640px] table-auto">
				<thead class="bg-slate-100">
					<tr>
						{#each columns as col}
							<th
								class="sticky top-0 z-10 px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b border-slate-200"
							>
								{col}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each paged as row, idx}
						<tr class={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
							{#each columns as col}
								<td
									class="px-4 py-2 align-top text-sm text-slate-800 border-b border-slate-100"
									title={fmt(row[col])}
								>
									{fmt(row[col])}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filtered.length === 0}
				<div class="p-4 text-sm text-slate-600">No rows match your search.</div>
			{/if}
		</div>

		<div class="mt-4 flex items-center justify-between">
			<div class="text-sm text-slate-600">Page {page} of {totalPages}</div>

			<div class="flex items-center gap-2">
				<button
					class="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
					on:click={prevPage}
					disabled={page <= 1}
				>
					Prev
				</button>

				<button
					class="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
					on:click={nextPage}
					disabled={page >= totalPages}
				>
					Next
				</button>
			</div>
		</div>
	{/if}
</main>
