<script lang="ts">
	import { goto } from '$app/navigation';

	let agreed = $state([]);

	function prev() {
		goto('/exam/agreement');
	}
	function next() {
		goto('/exam/start');
	}
</script>

<div class="bg-base-200 flex h-screen items-center justify-center p-5">
	<div class="card bg-base-100 max-w-xl shadow">
		<div class="card-body space-y-3">
			<div class="card-title text-base-content/80 text-xl">
				<img src="/favicon.png" alt="logo" class="w-10" />
				Prosedur Pelaksanaan Ujian Online
			</div>
			<div class="space-y-3 text-justify">
				<p>Baca dan pahami seluruh prosedur berikut sebelum memulai ujian:</p>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={1} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Ujian terdiri atas <strong>50 soal pilihan ganda</strong> yang harus diselesaikan.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={2} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Waktu pelaksanaan ujian adalah <strong>60 menit</strong>, dihitung sejak tombol
						<strong class="whitespace-nowrap">"Mulai Ujian"</strong> diklik.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={3} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Setiap jawaban benar bernilai <strong>5 poin</strong>. Tidak ada pengurangan nilai untuk
						jawaban salah atau kosong.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={4} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Header halaman ujian akan menampilkan <strong>Nama Anda</strong>,
						<strong>Posisi yang dilamar</strong>, <strong>Nomor Batch</strong>,
						<strong>Waktu Timer Ujian</strong>, dan
						<strong>Tombol Selesai</strong>.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={5} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						<em>Panel navigasi</em> berada di sisi kanan, dilengkapi tombol
						<strong>Sebelumnya</strong>, <strong>Selanjutnya</strong>, dan
						<strong>Angka Soal</strong> yang akan berubah warna saat terisi.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={6} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Halaman soal berada di sisi kiri layar dan akan menampilkan soal beserta pilihan
						jawaban.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={7} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Jika terjadi kendala, Anda dapat menutup aplikasi dan membukanya kembali untuk
						<strong> melanjutkan ujian </strong>
						sesuai jawaban yang telah diisi sebelumnya.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={8} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Ujian dapat diselesaikan dengan mengklik tombol <strong>Selesai</strong> atau secara
						otomatis saat <strong>waktu habis</strong>.
					</span>
				</label>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={9} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Saat ujian selesai, Anda akan <strong>dialihkan ke menu hasil ujian</strong> yang
						menampilkan <strong>jumlah skor yang diperoleh</strong>.
					</span>
				</label>
			</div>

			<div class="join flex w-full">
				<button onclick={prev} class="btn btn-secondary join-item">
					<iconify-icon icon="bx:chevron-left"></iconify-icon>
					Sebelumnya
				</button>
				<button onclick={next} class="btn btn-accent join-item grow" disabled={agreed.length < 9}>
					Mulai Ujian
					<iconify-icon icon="bx:chevron-right"></iconify-icon>
				</button>
			</div>
		</div>
	</div>
</div>
