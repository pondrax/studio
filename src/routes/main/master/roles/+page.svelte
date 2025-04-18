<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Modal, Toolbar } from '$lib/components';
	import { app, api, d, autofocus, createId } from '$lib/app';

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
		save?: Record<string, Item>;
		del?: Item[];
	};

	let forms: Forms = $state({
		save: undefined,
		del: undefined
	});

	async function getCollections() {
		const result = await api.from('roles').getList(query);
		return result;
	}

	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.from('roles').save(data);
		forms.save = undefined;
		refresh();
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.from('roles').delete(ids);
		forms.del = undefined;
		refresh();
	}

	function reset() {
		selections = [];
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

<Modal title="Simpan Data" bind:data={forms.save}>
	{#snippet children(items)}
		<form class="mt-5 flex flex-col gap-5" onsubmit={() => save(items)}>
			{#each Object.values(items) as item}
				<label class="label floating-label">
					<span>Nama Akses</span>
					<input
						type="text"
						class="input w-full"
						placeholder="Nama Hak Akses"
						bind:value={item.name}
						use:autofocus
						autocomplete="off"
					/>
				</label>
				<label class="label floating-label">
					<span>Deskripsi</span>
					<textarea class="textarea w-full" placeholder="Deskripsi" bind:value={item.description}
					></textarea>
				</label>
				<label class="label floating-label">
					<span>Akses</span>
					<input
						type="text"
						class="input w-full"
						placeholder="Akses"
						bind:value={item.permissions}
					/>
				</label>
				<label class="fieldset-label">
					<input type="checkbox" bind:checked={item.active} class="toggle" />
					{item.active ? 'Active' : 'Inactive'}
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
<Modal title="Hapus Data" bind:data={forms.del}>
	{#snippet children(items)}
		<p>Apakah anda yakin menghapus data ini ?</p>
		<div class="mt-5 max-h-100 overflow-auto">
			{#each items as item (item.id)}
				<p>
					<span class="badge badge-sm badge-neutral font-mono">{item.id}</span>
					{item.name}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Hapus
		</button>
	{/snippet}
</Modal>

<div class="flex flex-wrap items-center gap-2 px-3">
	<h1 class="mt-1 ml-12 text-xl capitalize">Hak Akses</h1>
</div>

<Toolbar bind:query {collections} {refresh}>
	<button
		class="btn btn-sm btn-secondary"
		aria-label="add"
		onclick={() => (forms.save = { [createId()]: { active: true } as Item })}
	>
		<iconify-icon icon="bx:plus" class="text-lg"></iconify-icon> Tambah
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
<div class="ml-2 overflow-x-auto">
	<table class="table-sm table-pin-rows table-pin-cols table">
		<thead>
			<tr>
				<th class="sticky z-1 w-1">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						checked={collections && selections.length === collections.items.length}
						onchange={() => {
							selections =
								collections && selections.length < collections.items.length
									? collections.items
									: [];
						}}
					/>
				</th>
				<!-- <th>ID</th> -->
				<th>Nama</th>
				<th>Deskripsi</th>
				<th>Akses</th>
				<th>Dibuat</th>
				<th>Diupdate</th>
			</tr>
		</thead>
		<tbody>
			{#if collections?.items}
				{@const items = collections.items}
				{#each collections.items || [] as item (item.id)}
					<tr>
						<th class="sticky z-1">
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									class="checkbox checkbox-sm"
									bind:group={selections}
									value={item}
								/>
								<button
									class="btn btn-xs btn-soft"
									aria-label="edit"
									onclick={() => (forms.save = { [item.id]: item })}
								>
									<iconify-icon icon="bx:pencil"></iconify-icon>
								</button>
							</div>
						</th>
						<!-- <td>
							{item.id}
						</td> -->
						<td>
							{item.name}
						</td>
						<td>
							{item.description}
						</td>
						<td>
							{JSON.stringify(item.permissions)}
						</td>
						<td class="w-1 whitespace-nowrap">
							{d(item.created).format('DD MMM YYYY HH:mm')}
						</td>
						<td class="w-1 whitespace-nowrap">
							{d(item.updated).format('DD MMM YYYY HH:mm')}
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
