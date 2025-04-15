<script lang="ts">
	import { page } from '$app/state';
	import { Modal, Toolbar, Select } from '$lib/components';
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
		expand: 'role,company'
	});

	type Forms = {
		save?: Record<string, Item>;
		del?: Item[];
	};

	let forms: Forms = $state({
		save: undefined,
		del: undefined
	});

	let _form = $state({
		confirmPassword: undefined
	});

	async function getCollections() {
		const result = await api.from('users').getList(query);
		return result;
	}

	async function save(data: NonNullable<Forms['save']>) {
		const result = await api.from('users').save(data);
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
		// _form.confirmPassword = undefined;
		for (const item of Object.keys(_form)) {
			_form[item as keyof typeof _form] = undefined;
		}
		collections = await getCollections();
	}

	$effect(() => {
		queryStringify(query);
		refresh();
	});
</script>

<Modal title="Save Record" bind:data={forms.save}>
	{#snippet children(items)}
		<form class="mt-5 flex flex-col gap-5" onsubmit={() => save(items)}>
			{#each Object.values(items) as item}
				<label class="label floating-label">
					<span>Username</span>
					<input
						type="text"
						class="input w-full"
						placeholder="Username"
						bind:value={item.username}
						use:autofocus
						autocomplete="off"
					/>
				</label>
				<label class="label floating-label">
					<span>Email</span>
					<input type="email" class="input w-full" placeholder="Email" bind:value={item.email} />
				</label>

				<Select
					bind:value={item.role_id}
					placeholder="Hak Akses"
					labelField="name"
					valueField="id"
					fetch="/roles/records?perPage=100&sort=name"
				></Select>

				<Select
					bind:value={item.company_id}
					placeholder="Divisi"
					labelField="name"
					valueField="id"
					fetch="/companies/records?perPage=100&sort=name"
				></Select>

				<label class="label floating-label">
					<span>Password</span>
					<input
						type="password"
						class="input w-full"
						placeholder="Password"
						autocomplete="new-password"
						bind:value={item.password}
					/>
				</label>
				<label class="label floating-label">
					<span>Konfirmasi Password</span>
					<input
						type="password"
						class="input w-full"
						placeholder="Confirm Password"
						autocomplete="new-password"
						bind:value={_form.confirmPassword}
					/>
				</label>
				{#if item.password !== _form.confirmPassword}
					<p class="text-error">Password tidak sama</p>
				{/if}
				<label class="fieldset-label">
					<input type="checkbox" bind:checked={item.verified} class="toggle" />
					{item.verified ? 'Verified' : 'Unverified'}
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
					{item.email}
				</p>
			{/each}
		</div>
		<button class="btn btn-error mt-5" onclick={() => del(items)} disabled={app.loading}>
			Hapus
		</button>
	{/snippet}
</Modal>

<div class="flex flex-wrap items-center gap-2 px-3">
	<h1 class="mt-1 ml-12 text-xl capitalize">Daftar Pengguna</h1>
</div>

<Toolbar bind:query {collections} {refresh}>
	<button
		class="btn btn-sm btn-secondary"
		aria-label="add"
		onclick={() => (forms.save = { [createId()]: { verified: true } as Item })}
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
				<th>Username</th>
				<th>Email</th>
				<th>Hak Akses</th>
				<th>Divisi</th>
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
							{item.username}
						</td>
						<td>
							{item.email}
						</td>
						<td>
							{item.role?.name}
						</td>
						<td>
							{item.company?.name}
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
