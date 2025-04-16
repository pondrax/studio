<script lang="ts">
	import { page } from '$app/state';
	import { Editor, Modal, Select, Toolbar } from '$lib/components';
	import { app, api, d, autofocus, createId, queryStringify } from '$lib/app';

	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type Item = Collections['items'][number];

	let collections: Collections | undefined = $state();

	let selections: Item[] = $state([]);
	let query = $state({
		page: Number(page.url.searchParams.get('page')) || 1,
		perPage: Number(page.url.searchParams.get('perPage')) || 30,
		sort: page.url.searchParams.get('sort') || '-created',
		filter: page.url.searchParams.get('filter') || '',
		expand: 'users'
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
		const result = await api.from('posts').getList(query);
		return result;
	}

	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.from('posts').save(data);
		forms.save = undefined;
		refresh();
	}

	async function del(data: NonNullable<Forms['del']>) {
		const ids = data.map((item) => item.id);
		await api.from('posts').delete(ids);
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
					bind:value={item.user_id}
					placeholder="User"
					labelField="username"
					valueField="id"
					fetch="/users/records?perPage=100&sort=-created"
				></Select>

				<label class="floating-label">
					<span>Judul Postingan Berita</span>
					<input
						class="input w-full"
						placeholder="Judul"
						bind:value={item.title}
						onkeyup={() => {
							item.slug = item.title
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '-')
								.replace(/^-|-$/g, '');
						}}
					/>
				</label>
				<label class="floating-label">
					<span>Slug</span>
					<input class="input w-full" placeholder="Slug " bind:value={item.slug} />
				</label>
				<div class="floating-label">
					<span>Isi Konten</span>
					<Editor bind:value={item.content} placeholder="Isi Konten" />
					<!-- <textarea class="textarea w-full" placeholder="Isi Konten" bind:value={item.content}
					></textarea> -->
				</div>
				<!-- <div class="floating-label">
					<span>Media</span>
					<input
						type="file"
						class="file-input w-full"
						placeholder="Media"
						bind:files={item.media}
					/>
				</div> -->
				<!-- <div>
					<div class="border-base-content/20 min-h-30 w-full rounded-lg border p-2">
						<div class="flex flex-col gap-1">
							{#each Object.keys(item.options || {}) as id (id)}
								<div class="join">
									<input
										type="text"
										class="input join-item w-full"
										placeholder="Opsi"
										bind:value={item.options[id]}
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
											delete item.options[id];
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
									item.options[id] = 'Opsi ' + (Object.keys(item.options || {}).length + 1);
									item.answer[id] = '';
								}}
							>
								<iconify-icon icon="bx:plus"></iconify-icon>
							</button>
						</div>
					</div>
				</div> -->
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
					{item.title}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Hapus
		</button>
	{/snippet}
</Modal>

<div class="flex flex-wrap items-center gap-2 px-3">
	<h1 class="mt-1 ml-12 text-xl capitalize">Daftar Postingan Berita</h1>
</div>

<Toolbar bind:query {collections} {refresh}>
	<button
		class="btn btn-sm btn-secondary"
		aria-label="add"
		onclick={() => {
			// let options: Record<string, string> = {};
			// let answer: Record<string, any> = {};
			// Array.from({ length: 5 }).forEach((_, i) => {
			// 	const id = createId();
			// 	options[id] = 'Opsi ' + (i + 1);
			// 	answer[id] = 0;
			// });
			forms.save = {
				[createId()]: {} as Item
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
	<table class="table-sm table-pin-rows table-pin-cols table">
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
				<th>Judul</th>
				<th>Isi Konten</th>
				<th>Kategori</th>
				<th>Author</th>
				<th>Dibuat</th>
				<th>Diupdate</th>
			</tr>
		</thead>
		<tbody>
			{#if collections?.items}
				{@const items = collections.items}
				{#each collections.items || [] as item (item.id)}
					<tr>
						<td class="sticky z-1">
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
						</td>
						<td>
							<span class="font-bold">{item.title}</span>
						</td>
						<td class="max-w-40">
							{@html item.content}
						</td>
						<td class="w-1 whitespace-nowrap">
							<span class="badge badge-sm badge-secondary">Kategori</span>
						</td>
						<td class="w-1 whitespace-nowrap">
							<span class="badge badge-sm badge-accent">{item.users?.username}</span>
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
