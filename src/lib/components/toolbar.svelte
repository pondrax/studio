<script lang="ts" generics="T">
	import { app, downloadCSV, downloadJSON } from '$lib/app';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let filename = page.url.pathname.replaceAll('/', '_');
	let { children, collections, refresh, query = $bindable() } = $props();
</script>

<div class="flex flex-wrap gap-2 px-3 md:justify-between">
	<div class="flex flex-wrap items-center gap-2">
		<button class="btn btn-sm btn-soft" aria-label="filter">
			<iconify-icon icon="bx:filter" class="text-lg"></iconify-icon> Filter
		</button>
		<!-- Default Buttons -->
		{@render children?.()}
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<div class="dropdown dropdown-end">
			<button class="pointer-auto text-xs">
				{collections?.elapsed}ms •
				{((collections?.page || 1) - 1) * query.perPage + 1}
				-
				{(collections?.page || 1) * query.perPage}
				of
				{collections?.totalItems}
			</button>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-100 rounded-box z-1 mt-1 w-30 p-0 shadow-sm"
			>
				{#each [10, 25, 50, 100] as item}
					<li>
						<button type="button" onclick={() => (query.perPage = item)}>{item}</button>
					</li>
				{/each}
			</ul>
		</div>
		<div class="join">
			<button
				class="btn btn-sm btn-soft btn-square join-item"
				aria-label="prev"
				onclick={() => query.page--}
				disabled={query.page == 1}
			>
				<iconify-icon icon="bx:chevron-left" class="text-lg"></iconify-icon>
			</button>
			<input
				type="number"
				class="input input-sm w-9 pr-5 pl-1 text-right"
				bind:value={query.page}
				min={1}
				max={collections?.totalPages}
			/>
			<button
				class="btn btn-sm btn-soft btn-square join-item"
				aria-label="next"
				onclick={() => query.page++}
				disabled={query.page == collections?.totalPages}
			>
				<iconify-icon icon="bx:chevron-right" class="text-lg"></iconify-icon>
			</button>
		</div>

		<button class="btn btn-sm btn-soft btn-square" aria-label="refresh" onclick={refresh}>
			<iconify-icon icon="bx:refresh" class="text-lg" class:animate-spin-reverse={app.loading}
			></iconify-icon>
		</button>

		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-sm btn-soft btn-square">
				<iconify-icon icon="bx:dots-horizontal" class="text-lg"></iconify-icon>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="dropdown-content menu bg-base-200 rounded-box z-1 mt-1 w-52 p-0 shadow-sm"
			>
				<li>
					<button onclick={refresh}>
						<iconify-icon icon="bx:refresh" class="text-lg"></iconify-icon>
						Refresh Rows
					</button>
				</li>
				<li class="m-0"></li>
				<li>
					<button onclick={() => downloadJSON(collections?.items || [], filename)}>
						<iconify-icon icon="bx:download" class="text-lg"></iconify-icon>
						Export JSON
					</button>
				</li>
				<li>
					<button onclick={() => downloadCSV(collections?.items || [], filename)}>
						<iconify-icon icon="bx:download" class="text-lg"></iconify-icon>
						Export CSV
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>
