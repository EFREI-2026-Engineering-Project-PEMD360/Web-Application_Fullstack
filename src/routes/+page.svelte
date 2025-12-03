<script lang="ts">
	let { data } = $props();
</script>

<h1>Liste des buckets R2</h1>

{#if data.buckets && data.buckets.length > 0}
	<ul>
		{#each data.buckets as bucket}
			<li>{bucket.Name}</li>
		{/each}
	</ul>
{:else}
	<p>Aucun bucket trouvé.</p>
{/if}
