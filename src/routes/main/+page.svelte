<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);

	let chartEl: HTMLCanvasElement;

	onMount(() => {
		new Chart(chartEl, {
			type: 'bar',
			data: {
				labels: ['Tes 1', 'Tes 2', 'Tes 3', 'Tes 4'],
				datasets: [
					{
						label: 'Skor Rata-rata',
						data: [85, 90, 78, 92]
						// backgroundColor: '#6366f1'
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					// y: { beginAtZero: true, max: 100 }
				}
				// plugins: { legend: { display: false } }
			}
		});
	});

	let auth = {
		username: 'Admin User'
	};

	let vacancies = [
		{ title: 'IT Developer', time: 'April 18, 2025 ~ Juni 30, 2025' },
		{ title: 'Rotasi HCM', time: 'April 20, 2025 ~ Juni 30, 2025' }
	];
	let agendas = [
		{ title: 'Rapat Evaluasi Kandidat', time: 'April 18, 2025 - 14:00' },
		{ title: 'Meeting Tim HR', time: 'April 20, 2025 - 10:00' }
	];

	let liveExams = [
		{
			title: 'Ujian Tes Online 1 - UX Designer',
			participants: 30,
			startTime: '10:00 AM',
			status: 'Berlangsung'
		},
		{
			title: 'Ujian Tes Online 1 - UX Designer',
			participants: 18,
			startTime: '12:00 AM',
			status: 'Selesai'
		}
	];

	// Dynamic announcements
	let announcements = [
		{
			id: 1,
			title: 'Pengumuman Hasil Tes Administrasi',
			content: 'Isi Pengumuman',
			category: 'Rekrutmen Eksternal',
			status: 'Publish',
			date: '30 Apr, 2025'
		},
		{
			id: 2,
			title: 'Pengumuman Hasil Tes Online Tahap 1',
			content: 'Isi Pengumuman',
			category: 'Rekrutmen Promosi',
			status: 'Draft',
			date: '30 Apr, 2025'
		},
		{
			id: 3,
			title: 'Pengumuman Hasil Tes Wawancara',
			content: 'Isi Pengumuman',
			category: 'Rekrutmen Rotasi',
			status: 'Publish',
			date: '30 Apr, 2025'
		}
	];
</script>

<main class="mt-10 space-y-6 overflow-auto p-3">
	<!-- Welcome Section -->
	<div class="card bg-white shadow">
		<div class="card-body">
			<h2 class="card-title">Hi, {auth.username} 👋</h2>
			<p class="text-gray-500">Here’s what’s happening today.</p>
			<div class="absolute top-3 right-3">
				<button type="button" class="btn btn-sm btn-secondary btn-soft" aria-label="Refresh">
					<iconify-icon icon="bx:refresh"></iconify-icon>
				</button>
			</div>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="stats grid w-full grid-cols-1 shadow md:grid-cols-3">
		<div class="stat">
			<div class="stat-figure text-info text-7xl">
				<iconify-icon icon="bx:briefcase-alt"></iconify-icon>
			</div>
			<div class="stat-title">Lowongan Terbuka</div>
			<div class="stat-value text-info">18</div>
			<div class="stat-desc">20 Semua Lowongan</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-primary text-7xl">
				<iconify-icon icon="bx:user"></iconify-icon>
			</div>
			<div class="stat-title">Pengguna Terdaftar</div>
			<div class="stat-value text-primary">245</div>
			<div class="stat-desc">+5 minggu ini</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary text-7xl">
				<iconify-icon icon="bx:check-circle"></iconify-icon>
			</div>
			<div class="stat-title">Pengguna Mendaftar Posisi</div>
			<div class="stat-value text-secondary">320</div>
			<div class="stat-desc">+12 hari ini</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
		<!-- Agenda Section -->
		<div class="card bg-white shadow">
			<div class="card-body">
				<h2 class="card-title">Lowongan Terkini</h2>
				<ul class="list-disc space-y-2 pl-5">
					{#each vacancies as vacancy}
						<li>
							<span class="font-medium">{vacancy.title}</span>
							<span class="block text-sm text-gray-500">{vacancy.time}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="card bg-white shadow">
			<div class="card-body">
				<h2 class="card-title">Agenda</h2>
				<ul class="list-disc space-y-2 pl-5">
					{#each agendas as agenda}
						<li>
							<span class="font-medium">{agenda.title}</span>
							<span class="block text-sm text-gray-500">{agenda.time}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Chart Card -->
		<div class="card bg-white shadow">
			<div class="card-body">
				<h2 class="card-title">Statistik Ujian</h2>
				<div>
					<canvas bind:this={chartEl} class="h-64 w-full"></canvas>
				</div>
			</div>
		</div>
	</div>

	<!-- Live Exam Preview -->
	<div class="card bg-white shadow">
		<div class="card-body">
			<h2 class="card-title">Preview Live Ujian</h2>
			{#if liveExams.length > 0}
				<div class="space-y-3">
					{#each liveExams as exam}
						<div class="flex items-center gap-4 rounded border p-3">
							<iconify-icon icon="bx:video-recording" class="text-primary animate-pulse text-4xl"
							></iconify-icon>
							<div class="flex-1">
								<p class="font-semibold">{exam.title}</p>
								<p class="text-sm text-gray-500">
									Peserta: {exam.participants} — Mulai: {exam.startTime}
								</p>
								<span class="badge badge-success mt-1">{exam.status}</span>
							</div>
							<button class="btn btn-sm btn-primary">Lihat Ujian</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">Belum ada ujian yang berlangsung.</p>
			{/if}
		</div>
	</div>

	<!-- Announcements Table -->
	<div class="card bg-white shadow">
		<div class="card-body">
			<h2 class="card-title">
				Berita Pengumuman
				<button class="btn btn-sm btn-secondary ml-5">
					<iconify-icon icon="bx:plus"></iconify-icon> Tambah
				</button>
			</h2>
			<div class="overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th>Judul</th>
							<th>Konten</th>
							<th>Kategori</th>
							<th>Status</th>
							<th>Tanggal</th>
							<th class="w-1"></th>
						</tr>
					</thead>
					<tbody>
						{#each announcements as a}
							<tr>
								<td>{a.title}</td>
								<td>{a.content}</td>
								<td>{a.category}</td>
								<td>
									<span class="badge badge-{a.status === 'Publish' ? 'info' : 'warning'} badge-sm">
										{a.status}
									</span>
								</td>
								<td>{a.date}</td>
								<td><button class="btn btn-sm btn-outline">Edit</button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
