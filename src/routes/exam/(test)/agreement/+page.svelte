<script lang="ts">
	import { goto } from '$app/navigation';

	let agreed = $state([]);

	function next() {
		goto('/exam/procedure');
	}
</script>

<div class="bg-base-200 flex h-screen items-center justify-center p-5">
	<div class="card bg-base-100 max-w-xl shadow">
		<div class="card-body space-y-3">
			<div class="card-title text-base-content/80 text-xl">
				<img src="/favicon.png" alt="logo" class="w-10" />
				Persetujuan Pelaksanaan Ujian Online
			</div>
			<div class="space-y-3 text-justify">
				<p>
					Silakan baca dan pahami seluruh ketentuan dan peraturan yang berlaku sebelum melanjutkan
					ujian.
				</p>

				<label class="label">
					<input type="checkbox" bind:group={agreed} value={1} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Bersedia mematuhi seluruh peraturan yang berlaku dan berkomitmen untuk tidak melakukan
						segala bentuk kecurangan.
					</span>
				</label>
				<label class="label">
					<input type="checkbox" bind:group={agreed} value={2} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Wajib mengaktifkan <strong>Kamera dan Microfon</strong> selama ujian. Jika perangkat tersebut
						terputus, ujian akan berhenti dan tidak dapat dilanjutkan.
					</span>
				</label>
				<label class="label">
					<input type="checkbox" bind:group={agreed} value={3} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Seluruh proses ujian akan dipantau secara ketat untuk menjamin integritas dan keadilan
						bagi semua peserta.
					</span>
				</label>
				<label class="label">
					<input type="checkbox" bind:group={agreed} value={4} class="checkbox checkbox-primary" />
					<span class="label-text ml-2 whitespace-normal">
						Keputusan akhir mengenai hasil ujian menjadi wewenang penuh pihak penyelenggara dan
						tidak dapat diganggu gugat.
					</span>
				</label>
			</div>

			<button onclick={next} class="btn btn-secondary w-full" disabled={agreed.length < 4}>
				Lanjutkan
				<iconify-icon icon="bx:chevron-right"></iconify-icon>
			</button>
		</div>
	</div>
</div>
