<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Modal } from '$lib/components';
	import { app, api, d, copyToClipboard, downloadJSON, downloadCSV, type Schema } from '$lib/app';

	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type Item = Collections['items'][number];

	let collectionName = $derived(page.params.name) as keyof Schema;
	let collections: Collections | undefined = $state();

	let selections: Item[] = $state([]);
	let query = $state({
		page: Number(page.url.searchParams.get('page')) || 1,
		perPage: Number(page.url.searchParams.get('perPage')) || 50,
		sort: page.url.searchParams.get('sort') || '-created',
		filter: page.url.searchParams.get('filter') || '',
		expand: page.url.searchParams.get('expand') || ''
	});

	type Forms = {
		edit?: boolean;
		save?: Record<string, Item>;
		del?: Item[];
	};

	let forms: Forms = $state({
		edit: false,
		save: undefined,
		del: undefined
	});

	let columns: { field: keyof Item; type: string }[] = $state([
		{ field: 'id', type: 'text' },
		{ field: 'level', type: 'number' },
		{ field: 'message', type: 'text' },
		{ field: 'data', type: 'json' },
		{ field: 'created', type: 'datetime' },
		{ field: 'updated', type: 'datetime' }
	]);

	let appends: Item[] = $state([]);
	let records: Record<string, Item> = $state({});
	let editable: Record<string, Item> = $state({});

	async function getCollections() {
		const result = await api.logs().getList(query);
		return result;
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.logs().delete(ids);
		forms.del = undefined;
		selections = [];
		refresh();
	}

	function reset() {
		appends = [];
		records = {};
		editable = {};
	}
	async function refresh() {
		reset();
		collections = await getCollections();
	}

	$effect(() => {
		const params = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, v.toString()]));
		goto(`?${params}`, { replaceState: true, noScroll: true, keepFocus: true });
	});

	$effect(() => {
		refresh();
	});
</script>

<Modal title="Delete Record" bind:data={forms.del}>
	{#snippet children(items)}
		<p>Do you want to remove this items ?</p>
		<div class="mt-5 max-h-100 overflow-auto">
			{#each items as item (item.id)}
				<p>
					{item.id} - {item.level} - {item.message}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Delete
		</button>
	{/snippet}
</Modal>

<div class="flex flex-wrap items-center gap-2 px-3">
	<button
		class="btn btn-sm btn-soft drawer-button"
		onclick={() => (app.sidebar = !app.sidebar)}
		aria-label="open sidebar"
	>
		<iconify-icon icon="bx:menu"></iconify-icon>
	</button>

	<h1 class="text-xl capitalize">Logs</h1>

	<button
		class="btn btn-sm btn-soft drawer-button ml-auto"
		onclick={() => (app.theme = app.theme == 'light' ? 'dark' : 'light')}
		aria-label="change theme"
	>
		<iconify-icon icon={app.theme == 'light' ? 'bx:sun' : 'bx:moon'}></iconify-icon>
	</button>
</div>
<!-- {JSON.stringify(records)} -->
<div class="flex flex-wrap gap-2 px-3 md:justify-between">
	<div class="flex flex-wrap items-center gap-2">
		<button class="btn btn-sm btn-soft" aria-label="filter">
			<iconify-icon icon="bx:filter" class="text-lg"></iconify-icon> Filter
		</button>
		<!-- <button class="btn btn-sm btn-soft" aria-label="columns">
			<iconify-icon icon="bx:slider" class="text-lg"></iconify-icon> Columns
		</button> -->

		{#if selections.length > 0}
			<button
				class="btn btn-sm btn-error"
				aria-label="delete"
				onclick={() => (forms.del = selections)}
			>
				<iconify-icon icon="bx:trash" class="text-lg"></iconify-icon>
				({selections.length}) Delete Records
			</button>
		{/if}
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<div class="text-xs">
			{collections?.elapsed}ms •
			{((collections?.page || 1) - 1) * query.perPage + 1}
			-
			{(collections?.page || 1) * query.perPage}
			of
			{collections?.totalItems}
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
			<iconify-icon icon="bx:refresh" class="text-lg"></iconify-icon>
		</button>

		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-sm btn-soft btn-square">
				<iconify-icon icon="bx:dots-horizontal" class="text-lg"></iconify-icon>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
				<li>
					<button onclick={refresh}>
						<iconify-icon icon="bx:refresh" class="text-lg"></iconify-icon>
						Refresh Rows
					</button>
				</li>
				<li></li>
				<li>
					<button onclick={() => downloadJSON(collections?.items || [], page.params.name)}>
						<iconify-icon icon="bx:download" class="text-lg"></iconify-icon>
						Export JSON
					</button>
				</li>
				<li>
					<button onclick={() => downloadCSV(collections?.items || [], page.params.name)}>
						<iconify-icon icon="bx:download" class="text-lg"></iconify-icon>
						Export CSV
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>

{#if collections?.items}
	{@const items = collections.items}
	<div class="ml-2 overflow-x-auto">
		<table class="table-xs table-pin-rows table-pin-cols table">
			<thead>
				<tr>
					<th class="w-1">
						<input
							type="checkbox"
							class="checkbox checkbox-sm"
							checked={selections.length == items.length}
							onchange={() => {
								selections = selections.length < items.length ? items : [];
							}}
						/>
					</th>
					<th class="w-30">
						<span>Level</span>
						<span class="text-base-content/50 font-light"> text </span>
					</th>
					<th>
						<span>Message</span>
						<span class="text-base-content/50 font-light"> text </span>
					</th>
					<th class="w-10">
						<span>Created</span>
						<span class="text-base-content/50 font-light"> timestamp </span>
					</th>
					<!-- {#each columns as { field, type }}
						<th>
							<span>
								{field}
							</span>
							<span class="text-base-content/50 font-light">
								{type}
							</span>
						</th>
					{/each} -->
				</tr>
			</thead>
			<tbody>
				{#each appends.concat(...(collections.items || [])) as item (item.id)}
					<tr>
						<th>
							<input
								type="checkbox"
								class="checkbox checkbox-sm"
								bind:group={selections}
								value={item}
							/>
						</th>
						<td>
							{#if item.level == 4}
								<span class="badge badge-error badge-soft w-full">ERROR (4)</span>
							{:else if item.level == 0}
								<span class="badge badge-info badge-soft w-full">INFO (0)</span>
							{/if}
						</td>
						<td>
							{#if item.data}
								{@const detail = item.data}
								{@const url = detail.url ? new URL(detail.url) : new URL(location.href)}

								{detail?.method}
								{url.pathname}
							{/if}
							<!-- {item.data?.url}
							{#each Object.entries(item.data) as [key, value]}
								<span class="badge badge-info badge-soft w-full">{key} - {value}</span>
							{/each} -->
							<!-- {#if item.message.length > 100}
								<span class="truncate">{item.message.substring(0, 100)}...</span>
							{:else}
								<span>{item.message}</span>
							{/if} -->
						</td>
						<td>
							{d(item.created).format('YYYY/MM/DD, HH:mm')}
						</td>
						<!-- <td>
							<div class="input input-sm input-ghost w-40">
								<button
									class="btn btn-xs btn-soft tooltip -ml-1"
									aria-label="copy"
									data-tip="Copy Value"
									onclick={(event) => copyToClipboard(event, item.id)}
								>
									<iconify-icon icon="bx:copy"></iconify-icon>
								</button>
								<div>{item.id}</div>
							</div>
						</td> -->
						<!-- {#each columns as { field, type }}
							<td class="p-0!" class:w-50={field === 'id'} class:w-30={type === 'datetime'}>
								<div class="flex">
									{#if field === 'id'}
										<div class="input input-sm input-ghost mr-2 w-40">
											<button
												class="btn btn-xs btn-soft tooltip -ml-1"
												aria-label="copy"
												data-tip="Copy Value"
												onclick={(event) => copyToClipboard(event, item[field])}
											>
												<iconify-icon icon="bx:copy"></iconify-icon>
											</button>
											<div>{item[field]}</div>
										</div>
									{:else if field == 'level'}
										{#if item.level == 4}
											<span class="badge badge-error">ERROR</span>
										{:else if item.level == 0}
											<span class="badge badge-info">INFO</span>
										{/if}
									{:else if type == 'datetime'}
										<div>
											{d(String(item[field])).format('YYYY/MM/DD, HH.mm')}
										</div>
									{:else if type == 'json'}
										<div class="whitespace-pre-wrap">
											{JSON.stringify(item[field], null, 2)}
										</div>
									{:else}
										<div>
											{item[field]}
										</div>
									{/if}
								</div>
							</td>
						{/each} -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
