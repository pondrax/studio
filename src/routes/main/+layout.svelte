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
	<title>Main Administration</title>
</svelte:head>

<div class="drawer bg-base-200 rounded-xl" class:drawer-open={app.sidebar}>
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="flex h-screen flex-col p-3">
			<div class="bg-base-100 relative flex h-full flex-col gap-3 rounded-xl p-3">
				<div class="absolute right-3 left-3 flex justify-between px-3">
					<button
						class="btn btn-sm btn-primary btn-soft drawer-button"
						onclick={() => (app.sidebar = !app.sidebar)}
						aria-label="open sidebar"
					>
						<iconify-icon icon="bx:menu"></iconify-icon>
					</button>

					<button
						class="btn btn-sm btn-soft btn-primary drawer-button"
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
			<li>
				<a href="/main/">
					<img src="/favicon.png" alt="favicon" class="h-7" />
					Main App
				</a>
			</li>
			<li>
				<div class="my-2 flex w-full p-1">
					<input class="input input-sm" placeholder="Search" />
				</div>
			</li>
			<li>
				<a href="/main/">
					<iconify-icon icon="bx:bxs-dashboard"></iconify-icon>
					Dashboard
				</a>
			</li>
			<li class="mx-2"></li>
			<li class="p-0">
				<div class="menu-title py-0!">Menu Utama</div>
			</li>
			<li>
				<a href="/main/menu/agenda">
					<iconify-icon icon="bx:user"></iconify-icon>
					Agenda
				</a>
			</li>
			<li>
				<a href="/main/menu/posts">
					<iconify-icon icon="bx:book"></iconify-icon>
					Posts
				</a>
			</li>
			<li>
				<a href="/main/menu/pages">
					<iconify-icon icon="bx:book"></iconify-icon>
					Halaman
				</a>
			</li>
			<li>
				<a href="/main/menu/gallery">
					<iconify-icon icon="bx:book"></iconify-icon>
					Galeri
				</a>
			</li>
			<li class="mx-2"></li>
			<li class="p-0">
				<div class="menu-title py-0!">Manajemen Lowongan</div>
			</li>
			<li>
				<a href="/main/vacancies/overview">
					<iconify-icon icon="bx:news"></iconify-icon>
					Overview
				</a>
			</li>
			<li>
				<a href="/main/vacancies/list">
					<iconify-icon icon="bx:news"></iconify-icon>
					Daftar Lowongan
				</a>
			</li>
			<li>
				<a href="/main/vacancies/applicants">
					<iconify-icon icon="bx:news"></iconify-icon>
					Daftar Pelamar
				</a>
			</li>
			<li>
				<a href="/main/vacancies/exam">
					<iconify-icon icon="bx:news"></iconify-icon>
					Daftar Ujian
				</a>
			</li>
			<li>
				<a href="/main/vacancies/report">
					<iconify-icon icon="bx:news"></iconify-icon>
					Laporan
				</a>
			</li>
			<li class="mx-2"></li>
			<li class="p-0">
				<div class="menu-title py-0!">Manajemen Pertanyaan</div>
			</li>
			<li>
				<a href="/main/questions/categories">
					<iconify-icon icon="bx:news"></iconify-icon>
					Kategori Pertanyaan
				</a>
			</li>
			<li>
				<a href="/main/questions/list">
					<iconify-icon icon="bx:news"></iconify-icon>
					Daftar Pertanyaan
				</a>
			</li>
			<li class="mx-2"></li>
			<li class="p-0">
				<div class="menu-title py-0!">Manajemen Aplikasi</div>
			</li>
			<li>
				<a href="/main/master/users">
					<iconify-icon icon="bx:user-circle"></iconify-icon>
					Pengguna
				</a>
			</li>
			<li>
				<a href="/main/master/roles">
					<iconify-icon icon="bx:award"></iconify-icon>
					Hak Akses
				</a>
			</li>
			<li>
				<a href="/main/master/references">
					<iconify-icon icon="bx:data"></iconify-icon>
					Referensi
				</a>
			</li>
		</ul>
	</div>
</div>
