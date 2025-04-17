<script lang="ts">
	import { app, api, d, createId } from '$lib/app';
	let { children } = $props();
</script>

<svelte:head>
	<title>Ujian Online</title>
</svelte:head>

<div>
	<div class="fixed top-3 right-3">
		<button
			class="btn btn-sm btn-soft btn-secondary drawer-button"
			onclick={() => (app.theme = app.theme == 'light' ? 'dark' : 'light')}
			aria-label="change theme"
		>
			<iconify-icon icon={app.theme == 'light' ? 'bx:sun' : 'bx:moon'}></iconify-icon>
		</button>
	</div>
	{@render children?.()}
</div>
