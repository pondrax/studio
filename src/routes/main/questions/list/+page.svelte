<script lang="ts">
	import { page } from '$app/state';
	import { Modal, Select, Toolbar } from '$lib/components';
	import { app, api, d, autofocus, createId, queryStringify } from '$lib/app';

	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type Item = Collections['items'][number];

	let collections: Collections | undefined = $state();

	let selections: Item[] = $state([]);
	let query = $state({
		page: Number(page.url.searchParams.get('page')) || 1,
		perPage: Number(page.url.searchParams.get('perPage')) || 50,
		sort: page.url.searchParams.get('sort') || '-created',
		filter: page.url.searchParams.get('filter') || '',
		expand: 'expandCategory'
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
		const result = await api.from('questions').getList(query);
		return result;
	}

	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.from('questions').save(data);
		forms.save = undefined;
		refresh();
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.from('users').delete(ids);
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
		queryStringify(query);
		refresh();
	});
</script>

<Modal title="Simpan Data" bind:data={forms.save}>
	{#snippet children(items)}
		<form class="mt-5 flex flex-col gap-5" onsubmit={() => save(items)}>
			{#each Object.values(items) as item}
				<Select
					bind:value={item.category}
					placeholder="Kategori Pertanyaan"
					labelField="name"
					valueField="id"
					fetch="/questionsCategory/records?perPage=100&sort=-created"
				></Select>
				<label class="label floating-label">
					<span>Pertanyaan</span>
					<textarea
						class="textarea min-h-20 w-full"
						placeholder="Pertanyaan"
						bind:value={item.question}
					></textarea>
				</label>
				<div class="label floating-label -mb-5">
					<span class="z-0!">Opsi</span>
				</div>
				<div>
					<div class="border-base-content/20 min-h-30 w-full rounded-lg border p-2">
						<div class="flex flex-col gap-1">
							{#each Object.keys(item.option || {}) as id (id)}
								<div class="join">
									<input
										type="text"
										class="input join-item w-full"
										placeholder="Opsi"
										bind:value={item.option[id]}
									/>
									<input
										type="text"
										class="input join-item"
										placeholder="Skor"
										bind:value={item.answer[id]}
									/>
									<button
										class="btn btn-soft join-item"
										type="button"
										aria-label="delete"
										onclick={() => {
											delete item.option[id];
											delete item.answer[id];
										}}
									>
										<iconify-icon icon="bx:trash"></iconify-icon>
									</button>
								</div>
							{/each}

							<button
								class="btn btn-soft"
								type="button"
								aria-label="add"
								onclick={() => {
									const id = createId();
									item.option[id] = 'Opsi ' + (Object.keys(item.option || {}).length + 1);
									item.answer[id] = '';
								}}
							>
								<iconify-icon icon="bx:plus"></iconify-icon>
							</button>
						</div>
					</div>
				</div>
			{/each}
			<div class="mt-2">
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
					<span class="badge badge-sm badge-secondary font-mono">{item.id}</span>
					{item.question}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Hapus
		</button>
	{/snippet}
</Modal>

<div class="flex flex-wrap items-center gap-2 px-3">
	<h1 class="mt-1 ml-12 text-xl capitalize">Daftar Pertanyaan</h1>
</div>

<Toolbar bind:query {collections} {refresh}>
	<button
		class="btn btn-sm btn-secondary"
		aria-label="add"
		onclick={() => {
			let option: Record<string, string> = {};
			let answer: Record<string, any> = {};
			Array.from({ length: 5 }).forEach((_, i) => {
				const id = createId();
				option[id] = 'Opsi ' + (i + 1);
				answer[id] = '';
			});
			forms.save = {
				[createId()]: { option, answer } as Item
			};
		}}
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
	<table class="table-xs table-pin-rows table-pin-cols table">
		<thead>
			<tr>
				<th class="sticky z-1 w-1">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						checked={selections.length > 0 && selections.length === collections?.items.length}
						onchange={() => {
							selections =
								collections && selections.length < collections.items.length
									? collections.items
									: [];
						}}
					/>
				</th>
				<!-- <th>ID</th> -->
				<th>Pertanyaan</th>
				<th>Opsi</th>
				<th>Kategori</th>
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
									onclick={() => {
										forms.save = {
											[item.id]: {
												...item
											}
										};
									}}
								>
									<iconify-icon icon="bx:pencil"></iconify-icon>
								</button>
							</div>
						</th>
						<td>
							<span class="font-bold">{item.question}</span>
						</td>
						<td>
							<div class="flex flex-col gap-1">
								{#each Object.keys(item.option || {}) as id (id)}
									<div class="flex gap-2">
										<div class="badge badge-sm badge-primary whitespace-nowrap">
											{item.answer[id]}
										</div>
										<div>{item.option[id]}</div>
									</div>
								{/each}
							</div>
						</td>
						<td class="w-1 whitespace-nowrap">
							<span class="badge badge-sm badge-secondary">{item.expandCategory?.name}</span>
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
