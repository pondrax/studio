<script lang="ts">
	import { page } from '$app/state';
	import { api } from '$lib/client';
	import { app } from '$lib/utils/state.svelte';

	const THEMES = {
		light: 'corporate',
		dark: 'business'
	};
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
		const result = await api.admins('collections').getList(query);
		return result;
	}

	async function refresh() {
		app.loading = true;
		collections = await getCollection();
		setTimeout(() => {
			app.loading = false;
		}, 2000);
	}

	$effect(() => {
		if (localStorage.theme) {
			app.theme = localStorage.theme;
		}
		refresh();
	});
	$effect(() => {
		if (app.theme) {
			localStorage.theme = app.theme;
			document.body.dataset.theme = THEMES[app.theme];
		} else {
			app.theme = localStorage.theme || 'light';
		}
	});
	// $effect(() => {
	// 	if (localStorage.theme) {
	// 		app.theme = localStorage.theme;
	// 	}
	// 	refresh();
	// });
</script>

<svelte:head>
	<title>App Studio</title>
</svelte:head>
<progress class="progress fixed top-0 z-15 h-1 w-full" class:invisible={!app.loading}></progress>
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
		<label for="overlay" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-64 p-2">
			<!-- Sidebar content here -->
			<li>
				<a href="/_/">
					<img src="/favicon.png" alt="favicon" class="h-7" />
					Studio
				</a>
			</li>
			<li>
				<div class="mt-2 flex w-full p-1">
					<input class="input input-sm" placeholder="Search" />
				</div>
			</li>
			<li>
				<div class=" mt-2 -mr-2 flex gap-2">
					<iconify-icon icon="bx:spreadsheet" class="text-2xl"></iconify-icon>
					Collection
					<button class="btn btn-xs btn-secondary ml-auto">+</button>
				</div>
				<!-- <ul> -->
				<!-- </ul> -->
			</li>
			<li>
				<ul>
					<li>
						<a href="/_/collections/users">
							<iconify-icon icon="bx:user"></iconify-icon>
							Users
						</a>
					</li>
					<li>
						<a href="/_/collections/posts">
							<iconify-icon icon="bx:book"></iconify-icon>
							Posts
						</a>
					</li>
					<li>
						<a href="/_/collections/comments">
							<iconify-icon icon="bx:book"></iconify-icon>
							Comments
						</a>
					</li>
				</ul>
			</li>
			<li>
				<h2>
					<iconify-icon icon="bx:spa" class="text-2xl"></iconify-icon>
					Designer
				</h2>
				<!-- <ul>
					<li><a href="/_/collections/users">Users</a></li>
					<li><a href="/_/collections/posts">Posts</a></li>
					<li><a href="/_/collections/comments">Comments</a></li>
				</ul> -->
			</li>
			<li>
				<h2 class="">
					<iconify-icon icon="bx:line-chart" class="text-2xl"></iconify-icon>
					Logs
				</h2>
				<!-- <ul>
					<li><a href="/_/collections/users">Users</a></li>
					<li><a href="/_/collections/posts">Posts</a></li>
					<li><a href="/_/collections/comments">Comments</a></li>
				</ul> -->
			</li>
		</ul>
	</div>
</div>
