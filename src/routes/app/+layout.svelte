<script lang="ts">
	import { page } from '$app/state';
	import { app, api } from '$lib/app';

	let { children } = $props();

	async function init() {
		const auth = api.auth;
		console.log(auth);
	}
	// type Collections = Awaited<ReturnType<typeof getCollection>>;
	// type Item = Collections['items'][number];

	// let collections: Collections | undefined = $state();

	// let query = $state({
	// 	page: Number(page.url.searchParams.get('page')) || 1,
	// 	perPage: Number(page.url.searchParams.get('perPage')) || 50,
	// 	sort: page.url.searchParams.get('sort') || '-created',
	// 	filter: page.url.searchParams.get('filter') || '',
	// 	expand: page.url.searchParams.get('expand') || ''
	// });

	// async function getCollection() {
	// 	const result = await api.from('users').getList(query);
	// 	return result;
	// }

	// async function refresh() {
	// 	collections = await getCollection();
	// }

	$effect(() => {
		init();
	});
</script>

<svelte:head>
	<title>Aplikasi Pendaftaran</title>
</svelte:head>

<div class="drawer bg-base-200 rounded-xl" class:drawer-open={app.sidebar}>
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="flex h-screen flex-col p-3">
			<div class="bg-base-100 relative flex h-full flex-col gap-3 rounded-xl p-3">
				<div class="absolute right-3 left-3 flex justify-between px-3">
					<button
						class="btn btn-sm btn-secondary btn-soft drawer-button"
						onclick={() => (app.sidebar = !app.sidebar)}
						aria-label="open sidebar"
					>
						<iconify-icon icon="bx:menu"></iconify-icon>
					</button>

					<button
						class="btn btn-sm btn-soft btn-secondary drawer-button"
						onclick={() => (app.theme = app.theme == 'light' ? 'dark' : 'light')}
						aria-label="change theme"
					>
						<iconify-icon icon={app.theme == 'light' ? 'bx:sun' : 'bx:moon'}></iconify-icon>
					</button>
				</div>
				{@render children?.()}
			</div>
		</div>
	</div>
	<div class="drawer-side z-10">
		<ul class="menu bg-base-200 text-base-content min-h-full w-64 p-2">
			<!-- <li>
				<a href="/main/">
					<img src="/favicon.png" alt="favicon" class="h-7" />
					Main App
				</a>
			</li> -->
			<li>
				<div class="my-3 flex flex-col justify-center bg-transparent!">
					<img
						src="/ava1.png"
						alt="avatar"
						class="bg-secondary ring-secondary h-25 w-25 rounded-full ring-2 ring-offset-2"
					/>
					<div class="-my-1">Username</div>
					<div class="join join-horizontal">
						<a href="/app/profile" class="btn btn-xs btn-secondary join-item">Profil</a>
						<a href="/" class="btn btn-xs btn-error join-item">Logout</a>
					</div>
				</div>
			</li>
			<!-- <li>
				<div class="my-2 flex w-full p-1">
					<input class="input input-sm" placeholder="Search" />
				</div>
			</li> -->
			<li>
				<a href="/app/">
					<iconify-icon icon="bx:bxs-dashboard"></iconify-icon>
					Dashboard
				</a>
			</li>
			<li></li>
			<li>
				<a href="/app/vacancies">
					<iconify-icon icon="bx:news"></iconify-icon>
					Daftar Lowongan
				</a>
			</li>
			<li>
				<a href="/app/applied">
					<iconify-icon icon="bx:book-bookmark"></iconify-icon>
					History Lamaran
				</a>
			</li>
			<li>
				<a href="/app/schedule">
					<iconify-icon icon="bx:calendar"></iconify-icon>
					Jadwal Kegiatan
				</a>
			</li>
			<li></li>
			<li>
				<a href="/app/notifications">
					<iconify-icon icon="bx:bell"></iconify-icon>
					Notifikasi
				</a>
			</li>
			<li>
				<a href="/app/profile">
					<iconify-icon icon="bx:user"></iconify-icon>
					Profil
				</a>
			</li>
		</ul>
	</div>
</div>
