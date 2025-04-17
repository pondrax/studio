<script lang="ts">
	let profileCompleted = $state(false);
	let passedTrial = $state(false);
	let auth = {
		username: 'John Doe'
	};
</script>

<main class="mt-10 space-y-6 overflow-auto p-3">
	<!-- Welcome Card -->
	<div class="card shadow-base-content/10 shadow">
		<div class="card-body">
			<h2 class="card-title">Hi, {auth.username} 👋</h2>
			{#if !profileCompleted}
				<p class="text-gray-500">Lengkapi profil anda untuk melanjutkan pendaftaran.</p>
				<div><a href="/app/profile" class="btn btn-info btn-sm">Perbarui Profil</a></div>
			{/if}
			{#if passedTrial}
				<p class="text-gray-500">
					Selamat Anda telah lulus ujian, anda dapat menempuh tahap selanjutnya.
				</p>
				<div>
					<a href="/app/" class="btn btn-secondary btn-sm">Lihat Hasil Ujian</a>
				</div>
			{/if}
		</div>
	</div>

	<div class="card shadow-base-content/10 shadow">
		<div class="card-body">
			<h2 class="card-title">Jadwal yang akan datang</h2>
			<div class="flex items-center gap-4">
				<div>
					<iconify-icon icon="bx:calendar" class="text-base-content/80 text-8xl"></iconify-icon>
				</div>
				<div>
					<p class="text-lg font-semibold">Ujian Tes Online 1 - UX Designer @ Divisi X</p>
					<p class="text-sm text-gray-500">April 20, 2025 - 10:00 AM (Online)</p>
					<button class="btn btn-sm btn-secondary mt-2">View Details</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="stats shadow-base-content/10 flex w-full shadow">
		<div class="stat">
			<div class="stat-figure text-info text-7xl">
				<iconify-icon icon="bx:atom"></iconify-icon>
			</div>
			<div class="stat-title">Trial Ujian Online</div>
			<div class="stat-value text-info">10 <span class="text-gray-500">Soal</span></div>
			<div class="stat-actions">
				<a href="/exam" class="btn btn-sm btn-info">Mulai Trial Ujian (Buka SEB)</a>
			</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-primary text-7xl">
				<iconify-icon icon="bx:analyse"></iconify-icon>
			</div>
			<div class="stat-title">Jabatan Dilamar</div>
			<div class="stat-value text-primary">UX Designer</div>
			<div class="stat-desc">Divisi X</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary text-7xl">
				<iconify-icon icon="bx:bell"></iconify-icon>
			</div>
			<div class="stat-title">Notifications</div>
			<div class="stat-value text-secondary">2</div>
			<div class="stat-desc">Unread messages</div>
		</div>
	</div>

	<!-- Vacancies List -->
	<div class="card shadow-base-content/10 shadow">
		<div class="card-body">
			<h2 class="card-title">Lowongan Tersedia</h2>
			<div class="overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th>Jabatan</th>
							<th>Divisi</th>
							<th>Jadwal</th>
							<th class="w-1"></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Backend Developer</td>
							<td>Acme Corp</td>
							<td>April 30, 2025 ~ Juni 31, 2025</td>
							<td><button class="btn btn-sm btn-outline">Apply</button></td>
						</tr>
						<tr>
							<td>UX Designer</td>
							<td>Pixel Studio</td>
							<td>April 30, 2025 ~ Juni 31, 2025</td>
							<td><button class="btn btn-sm btn-outline">Apply</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Applied Applications -->
	<div class="card shadow-base-content/10 shadow">
		<div class="card-body">
			<h2 class="card-title">Jabatan yang dilamar</h2>
			<div class="overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th>Jabatan</th>
							<th>Divisi</th>
							<th>Status</th>
							<th>Terdaftar Pada</th>
							<th class="w-1"></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Frontend Developer</td>
							<td>Acme Corp</td>
							<td><span class="badge badge-info">Under Review</span></td>
							<td>April 12, 2025</td>
							<td><button class="btn btn-sm btn-outline">Details</button></td>
						</tr>
						<tr>
							<td>UX Designer</td>
							<td>Pixel Studio</td>
							<td><span class="badge badge-success">Interview Scheduled</span></td>
							<td>April 9, 2025</td>
							<td><button class="btn btn-sm btn-outline">Details</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
