<script>
	import { onMount } from 'svelte';

	let iframe;
	let mpSdk;

	onMount(async () => {
		try {
			// Import the SDK from its new location in src/lib
			// @ts-ignore
			const { connect } = await import('$lib/matterport/sdk.es6.js');
			mpSdk = await connect(iframe);
			
			console.log('Matterport SDK connected', mpSdk);
			onShowcaseConnect(mpSdk);
		} catch (e) {
			console.error('Matterport SDK connection failed:', e);
		}
	});

	function onShowcaseConnect(sdk) {
		sdk.Camera.pose.subscribe(function (pose) {
			console.log('Camera pose updated:', pose);
		});
	}
</script>

<p>Matterport Showcase</p>
<iframe
	bind:this={iframe}
	title="Matterport Showcase"
	width="853"
	height="480"
	src="https://my.matterport.com/show?m=SxQL3iGyoDo&play=1&applicationKey=wxdq9q4dpay6wcrm41b1ynnib"
	frameborder="0"
	allow="fullscreen; vr"
>
</iframe>