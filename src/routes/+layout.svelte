<script lang="ts">
	import { app } from '$lib/app';
	import '../app.css';
	import 'iconify-icon';
	let { children } = $props();

	const THEMES = {
		light: 'corporate',
		dark: 'business'
	};
	$effect(() => {
		if (localStorage.theme) {
			app.theme = localStorage.theme;
		}
	});
	$effect(() => {
		if (app.theme) {
			localStorage.theme = app.theme;
			document.body.dataset.theme = THEMES[app.theme];
		} else {
			app.theme = localStorage.theme || 'light';
		}
	});
</script>

<progress class="progress fixed top-0 z-15 h-1 w-full" class:invisible={!app.loading}></progress>
<div class="flex min-h-screen flex-col">
	{@render children()}
</div>

<div class="fixed right-10 bottom-5 z-100">
	<div class="not-hover:stack stack-top flex w-64 flex-col gap-1">
		{#each app.alerts as alert}
			<div
				role="alert"
				class="alert bg-base-100 shadow-base-content/20 relative items-start rounded-xl shadow"
				onfocus={() => alert.pause()}
				onmouseover={() => alert.pause()}
				onblur={() => alert.start()}
				onmouseout={() => alert.start()}
			>
				<div class="-mr-5">
					<div class="mb-2 flex items-center gap-2">
						{#if alert.type == 'error'}
							<iconify-icon icon="bx:error-circle" class="text-error text-2xl"></iconify-icon>
							Error
						{:else}
							<iconify-icon icon="bx:info-circle" class="text-info text-2xl"></iconify-icon>
							Success
						{/if}
					</div>
					<div>{alert.message}</div>
				</div>
				<button onclick={alert.clear} class="btn btn-sm btn-neutral absolute -top-2 right-2">
					x
				</button>
			</div>
		{/each}
	</div>
</div>
