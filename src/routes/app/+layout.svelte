<script lang="ts">
	import { page } from '$app/state';
	import { app, api } from '$lib/app';

	let { children } = $props();
	type Collections = Awaited<ReturnType<typeof getCollection>>;
	type Item = Collections['items'][number];

	let collections: Collections | undefined = $state();

	let query = $state({
		page: Number(page.url.searchParams.get('page')) || 1,
		perPage: Number(page.url.searchParams.get('perPage')) || 50,
		sort: page.url.searchParams.get('sort') || '-created',
		filter: page.url.searchParams.get('filter') || '',
		expand: page.url.searchParams.get('expand') || ''
	});

	async function getCollection() {
		const result = await api.from('users').getList(query);
		return result;
	}

	async function refresh() {
		collections = await getCollection();
	}

	$effect(() => {
		refresh();
	});
</script>

<svelte:head>
	<title>Application</title>
</svelte:head>

<div class="drawer bg-base-200 rounded-xl" class:drawer-open={app.sidebar}>
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="flex h-screen flex-col p-3">
			<div class=" bg-base-100 flex h-full flex-col gap-3 rounded-xl p-3">
				{@render children?.()}
			</div>
		</div>
	</div>
	<div class="drawer-side z-10">
		<ul class="menu bg-base-200 text-base-content min-h-full w-64 p-2">
			<li>
				<a href="/app">
					<img src="/favicon.png" alt="favicon" class="h-7" />
					Application
				</a>
			</li>
			<li>
				<div class="mt-2 flex w-full p-1">
					<input class="input input-sm" placeholder="Search" />
				</div>
			</li>
			<li>
				<a href="/app/vacancies">
					<iconify-icon icon="bx:book" class="text-2xl"></iconify-icon>
					Lowongan
				</a>
			</li>
			<li>
				<a href="/app/notifications">
					<iconify-icon icon="bx:notification" class="text-2xl"></iconify-icon>
					Notifikasi
				</a>
			</li>
			<li>
				<a href="/app/profile">
					<iconify-icon icon="bx:user-circle" class="text-2xl"></iconify-icon>
					Profil
				</a>
			</li>
		</ul>
	</div>
</div>
