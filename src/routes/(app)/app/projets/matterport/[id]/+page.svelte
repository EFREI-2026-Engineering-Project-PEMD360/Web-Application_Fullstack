<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { ArrowLeft } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let iframe: HTMLIFrameElement;
	let mpSdk: any;

	onMount(async () => {
		try {
			// @ts-ignore
			const { connect } = await import('$lib/matterport/sdk.es6.js');
			mpSdk = await connect(iframe);
			
			console.log('Matterport SDK connected', mpSdk);
		} catch (e) {
			console.error('Matterport SDK connection failed:', e);
		}
	});
</script>

<div class="h-full w-full p-6 font-[Poppins]">
	<div class="mb-6 flex items-center gap-4">
		<h1 class="text-2xl font-bold text-gray-900">{data.projet.libelle}</h1>
	</div>

	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm h-[80vh]">
		<iframe
			bind:this={iframe}
			title="Matterport Showcase"
			class="h-full w-full"
			src="https://my.matterport.com/show?m={data.projet.id}&play=1&applicationKey=wxdq9q4dpay6wcrm41b1ynnib"
			frameborder="0"
			allow="fullscreen; vr"
		>
		</iframe>
	</div>
</div>
