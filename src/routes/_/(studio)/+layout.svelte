<script lang="ts">
	import { page } from '$app/state';
	import { app, api, alert } from '$lib/app';

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
		const result = await api.from('users').getList(query);
		return result;
	}

	async function refresh() {
		collections = await getCollection();
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
</script>

<svelte:head>
	<title>Application Studio</title>
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
		<ul class="menu bg-base-200 text-base-content min-h-full w-64 p-2">
			<li>
				<a href="/_/">
					<img src="/favicon.png" alt="favicon" class="h-7" />
					Application Studio
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
			<!-- <li>
				<h2>
					<iconify-icon icon="bx:spa" class="text-2xl"></iconify-icon>
					Designer
				</h2>
				<ul>
					<li><a href="/_/collections/users">Users</a></li>
					<li><a href="/_/collections/posts">Posts</a></li>
					<li><a href="/_/collections/comments">Comments</a></li>
				</ul>
			</li> -->
			<li>
				<a href="/_/notifications">
					<iconify-icon icon="bx:notification" class="text-2xl"></iconify-icon>
					Notifications
				</a>
			</li>
			<li>
				<a href="/_/logs">
					<iconify-icon icon="bx:line-chart" class="text-2xl"></iconify-icon>
					Logs
				</a>
			</li>
		</ul>
	</div>
</div>

<div class="fixed right-10 bottom-5 z-100">
	<div class="not-hover:stack stack-top flex w-64 flex-col gap-1">
		{#each app.alerts as alert}
			<div
				role="alert"
				class="alert bg-base-100 shadow-base-content/20 relative items-start rounded-xl shadow"
				onfocus={() => alert.pause()}
				onmouseover={() => alert.pause()}
				onblur={() => alert.start()}
				onmouseout={() => alert.start()}
			>
				<div class="-mr-5">
					<div class="mb-2 flex items-center gap-2">
						{#if alert.type == 'error'}
							<iconify-icon icon="bx:error-circle" class="text-error text-2xl"></iconify-icon>
							Error
						{:else}
							<iconify-icon icon="bx:info-circle" class="text-info text-2xl"></iconify-icon>
							Success
						{/if}
					</div>
					<div>{alert.message}</div>
				</div>
				<button onclick={alert.clear} class="btn btn-sm btn-neutral absolute -top-2 right-2">
					x
				</button>
			</div>
		{/each}
	</div>
</div>
