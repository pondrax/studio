<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Modal } from '$lib/components';
	import {
		app,
		api,
		d,
		createId,
		copyToClipboard,
		downloadJSON,
		downloadCSV,
		type Schema
	} from '$lib/app';

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
		save?: Record<string, Item>;
		send?: Item[];
		del?: Item[];
	};

	let forms: Forms = $state({
		edit: false,
		save: undefined,
		del: undefined
	});

	let columns: { field: keyof Item; type: string }[] = $state([
		{ field: 'id', type: 'text' },
		{ field: 'type', type: 'text' },
		{ field: 'to', type: 'text' },
		{ field: 'subject', type: 'text' },
		{ field: 'content', type: 'text' },
		{ field: 'status', type: 'text' },
		{ field: 'scheduled', type: 'datetime' },
		{ field: 'sent', type: 'datetime' },
		{ field: 'created', type: 'datetime' },
		{ field: 'updated', type: 'datetime' }
	]);

	// let columns = $derived(
	// 	Object.keys(collections?.items?.at(-1) || {}).map((field) => ({
	// 		field,
	// 		type: ['created', 'updated'].includes(field) ? 'datetime' : 'text'
	// 	}))
	// );
	let appends: (Item & { __new?: boolean })[] = $state([]);
	let records: Record<string, Item> = $state({});
	let editable: Record<string, Item> = $state({});

	function addRecord() {
		const record = {
			id: createId(15),
			created: d().toDate(),
			updated: d().toDate()
			// created: d().format('YYYY-MM-DDTHH:mm'),
			// updated: d().format('YYYY-MM-DDTHH:mm')
		};
		records[record.id] = record as Item;
		appends = [
			{
				...(record as Item),
				__new: true
			},
			...appends
		];
	}
	async function getCollections() {
		const result = await api.notifications().getList(query);
		return result;
	}

	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.notifications().save(data);
		forms.save = undefined;
		refresh();
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.notifications().delete(ids);
		forms.del = undefined;
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

<Modal title="Save Record" bind:data={forms.save}>
	{#snippet children(items)}
		<p>Do you want to save this items ?</p>
		<div class="mt-5 max-h-100 overflow-auto">
			{#each Object.entries(items) as [id, item] (id)}
				<p></p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => save(items)} disabled={app.loading}>
			Save
		</button>
	{/snippet}
</Modal>
<Modal title="Delete Record" bind:data={forms.del}>
	{#snippet children(items)}
		<p>Do you want to remove this items ?</p>
		<div class="mt-5 max-h-100 overflow-auto">
			{#each items as item (item.id)}
				<p>
					{columns
						.slice(0, 2)
						.map(({ field }) => item[field])
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
	<h1 class="mt-1 ml-12 text-xl capitalize">Overview</h1>
</div>

<div class="grid grid-cols-1 p-3 md:grid-cols-3">
	<div>aaa</div>
</div>
