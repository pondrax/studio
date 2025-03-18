<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '$lib/client';
	import { Modal } from '$lib/components';
	import { app, createId, copyToClipboard, downloadJSON, downloadCSV } from '$lib/utils';

	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type Item = Collections['items'][number];

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
		save?: { list?: Item };
		del?: Item[];
		// del?: Partial<Reference>[];
	};

	let forms: Forms = $state({
		edit: false,
		save: undefined,
		del: undefined
	});

	let columns = $derived(Object.keys(collections?.items?.at(-1) || {}).map((field) => field));
	let appends: Item[] = $state([]);
	let records: Record<string, Item> = $state({});
	let editable: Record<string, Item> = $state({});

	function addRecord() {
		const id = createId(15);
		records[id] = {
			id,
			created: new Date().toISOString(),
			updated: new Date().toISOString()
		};
		appends = [
			{
				...records[id],
				__new: true
			},
			...appends
		];
	}
	function discardRecord() {
		appends = [];
		records = {};
		editable = {};
	}
	async function getCollections() {
		const result = await api.from(page.params.name).getList(query);
		return result;
	}
	async function del(data: NonNullable<Forms['del']>) {
		app.loading = true;
		const ids = data.map((item) => item.id);
		try {
			await api.from(page.params.name).delete(ids);
			forms.del = undefined;
			refresh();
		} catch (e) {
			console.log(e);
		}
		setTimeout(() => {
			app.loading = false;
		}, 2000);
	}
	async function refresh() {
		records = {};
		editable = {};
		selections = [];
		app.loading = true;
		collections = await getCollections();
		setTimeout(() => {
			app.loading = false;
		}, 2000);
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
					{columns
						.slice(0, 2)
						.map((field) => item[field])
						.join(' - ')}
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

	<h1 class="text-xl capitalize">collections / {page.params.name}</h1>

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

		<button class="btn btn-sm btn-secondary" aria-label="add" onclick={addRecord}>
			<iconify-icon icon="bx:plus" class="text-lg"></iconify-icon> Add Record
		</button>

		{#if Object.keys(records).length > 0}
			<button class="btn btn-sm btn-primary" aria-label="save">
				<iconify-icon icon="bx:save" class="text-lg"></iconify-icon>
				({Object.keys(records).length}) Save Record
			</button>
			<button class="btn btn-sm btn-ghost underline" aria-label="discard" onclick={discardRecord}>
				Discard changes
			</button>
		{/if}
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
					{#each columns as field}
						<th>{field}</th>
					{/each}
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
						{#each columns as field}
							<td class="p-0!" class:w-50={field === 'id'}>
								<div class="flex">
									{#if field === 'id'}
										<button
											class="btn btn-xs btn-soft tooltip m-1"
											aria-label="copy"
											data-tip="Copy Value"
											onclick={(event) => copyToClipboard(event, item[field])}
										>
											<iconify-icon icon="bx:copy"></iconify-icon>
										</button>
									{/if}
									<div
										class={`
                      input input-sm input-ghost w-full outline-offset-0! 
                      ${item.__new || records?.[item.id]?.[field] ? 'bg-warning/10!' : ''}`}
									>
										<input
											type="text"
											class="w-full"
											value={records[item.id]?.[field] ?? item[field]}
											oninput={(event) => {
												const target = event.target as HTMLInputElement;
												records[item.id] = { ...records[item.id], [field]: target.value };
											}}
											readonly={!editable?.[item.id]?.[field]}
											ondblclick={() =>
												(editable[item.id] = { ...editable[item.id], [field]: true })}
										/>
									</div>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
