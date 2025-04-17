<script lang="ts">
	import { page } from '$app/state';
	import { Modal, Toolbar } from '$lib/components';
	import { app, api, d, autofocus, createId, queryStringify } from '$lib/app';

	type CollectionsCategory = Awaited<ReturnType<typeof getCollectionsCategory>>;
	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type ItemCategory = CollectionsCategory['items'][number];
	type Item = Collections['items'][number];

	let collections: CollectionsCategory | undefined = $state();

	let selections: Item[] = $state([]);
	let query = $state({
		page: Number(page.url.searchParams.get('page')) || 1,
		perPage: Number(page.url.searchParams.get('perPage')) || 30,
		sort: page.url.searchParams.get('sort') || 'name',
		filter: page.url.searchParams.get('filter') || '',
		expand: 'references'
	});

	type Forms = {
		saveCategory?: Record<string, ItemCategory>;
		save?: Record<string, Item>;
		del?: Item[];
	};

	let forms: Forms = $state({
		saveCategory: undefined,
		save: undefined,
		del: undefined
	});

	let options = $state({
		active: false
	});

	async function getCollectionsCategory() {
		let result = await api.from('referencesCategory').getList(query);
		result = {
			...result,
			items: result.items.map((item) => {
				return {
					...item,
					references: item.references.sort((a, b) => (a.order || 0) - (b.order || 0)) || []
				};
			})
		};
		return result;
	}
	async function getCollections() {
		const result = await api.from('references').getList(query);
		return result;
	}

	async function saveCategory(data: NonNullable<Forms['saveCategory']>) {
		const result = await api.from('referencesCategory').save(data);
		forms.save = undefined;
		refresh();
	}
	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.from('references').save(data);
		forms.save = undefined;
		refresh();
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.from('referencesCategory').delete(ids);
		forms.del = undefined;
		refresh();
	}

	function reset() {
		selections = [];
	}
	async function refresh() {
		reset();
		collections = await getCollectionsCategory();
	}

	$effect(() => {
		queryStringify(query);
		refresh();
	});
</script>

<Modal title="Simpan Data" bind:data={forms.saveCategory}>
	{#snippet children(items)}
		<form class="mt-5 flex flex-col gap-5" onsubmit={() => saveCategory(items)}>
			{#each Object.values(items) as item}
				<!-- <label class=" floating-label">
					<span>ID</span>
					<input type="text" class="input w-full" placeholder="ID" bind:value={item.id} />
				</label> -->
				<label class="floating-label">
					<span>Kategori Referensi</span>
					<input
						type="text"
						class="input w-full"
						placeholder="Kategori Pertanyaan"
						bind:value={item.name}
						use:autofocus
						autocomplete="off"
					/>
				</label>
				<label class="floating-label">
					<span>Deskripsi</span>
					<textarea class="textarea w-full" placeholder="Deskripsi" bind:value={item.description}
					></textarea>
				</label>
			{/each}
			<div>
				<button type="submit" class="btn btn-secondary" disabled={app.loading}>
					<iconify-icon icon="bx:save"></iconify-icon>
					Simpan
				</button>
			</div>
		</form>
	{/snippet}
</Modal>
<Modal title="Delete Record" bind:data={forms.del}>
	{#snippet children(items)}
		<p>Apakah anda yakin menghapus data ini ?</p>
		<div class="mt-5 max-h-100 overflow-auto">
			{#each items as item (item.id)}
				<p>
					<span class="badge badge-sm badge-secondary font-mono">{item.id}</span>
					{item.name}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Hapus
		</button>
	{/snippet}
</Modal>

<main class=" space-y-3 overflow-auto">
	<div class="flex flex-wrap items-center gap-2 px-3">
		<h1 class="mt-1 ml-12 text-xl capitalize">Daftar Referensi</h1>
	</div>

	<Toolbar bind:query {collections} {refresh}>
		<button
			class="btn btn-sm btn-secondary"
			aria-label="add"
			onclick={() => (forms.save = { [createId()]: {} as Item })}
		>
			<iconify-icon icon="bx:plus" class="text-lg"></iconify-icon> Tambah Kategori
		</button>
		<button
			class="btn btn-sm btn-info btn-soft"
			aria-label="show/hide"
			onclick={() => (options.active = !options.active)}
		>
			<iconify-icon icon="bx:show" class="text-lg"></iconify-icon> Tampilkan Non Aktif
		</button>
		{#if selections.length > 0}
			<button
				class="btn btn-sm btn-error"
				aria-label="delete"
				onclick={() => (forms.del = selections)}
				disabled={app.loading}
			>
				<iconify-icon icon="bx:trash" class="text-lg"></iconify-icon> Hapus
			</button>
		{/if}
	</Toolbar>
	<div class="px-3">
		{#each collections?.items || [] as references (references.id)}
			{@const refItems = references.references || []}
			<div>
				<div class="text-lg font-semibold">{references.name}</div>
				<div>{references.description}</div>
				<div class="textarea w-full space-y-1 space-x-1 p-1">
					{#each references.references || [] as ref}
						{#if options.active || ref.active}
							<div class="join">
								<button class="btn btn-sm btn-secondary btn-soft join-item">
									{ref.name}
								</button>
								<button
									class="btn btn-sm btn-secondary btn-soft join-item"
									aria-label="show/hidden"
									onclick={async () => {
										save({
											[ref.id]: { ...ref, active: !ref.active }
										});
										// (ref.active = !ref.active)
									}}
								>
									<iconify-icon icon={ref.active ? 'bx:hide' : 'bx:show'}></iconify-icon>
								</button>

								<button class="btn btn-sm btn-error btn-soft join-item" aria-label="del">
									<iconify-icon icon="bx:trash"></iconify-icon>
								</button>
							</div>
						{/if}
					{/each}

					<button class="btn btn-sm btn-info join-item" aria-label="add">
						<iconify-icon icon="bx:plus"></iconify-icon>
					</button>
				</div>
				<div class="divider"></div>
			</div>
		{/each}
	</div>
</main>
