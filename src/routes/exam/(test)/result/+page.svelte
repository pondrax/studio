<script lang="ts">
	import { goto } from '$app/navigation';
	import { text } from '@sveltejs/kit';

	// Contoh data hasil ujian per kategori
	let categories = [
		{
			name: 'Wawasan Perusahaan',
			score: 75, // Skor kategori ini
			passing: 60 // Skor batas lulus untuk kategori ini
		},
		{
			name: 'Akhlak',
			score: 90, // Skor kategori ini
			passing: 60 // Skor batas lulus untuk kategori ini
		},
		{
			name: 'Kemampuan Teknis',
			score: 55, // Skor kategori ini
			passing: 60 // Skor batas lulus untuk kategori ini
		}
	];

	// Menghitung total skor
	let totalScore = categories.reduce((acc, category) => acc + category.score, 0);
	let totalCategories = categories.length;
</script>

<div class="bg-base-200 flex h-screen items-center justify-center p-5">
	<div class="card bg-base-100 max-w-xl shadow">
		<div class="card-body space-y-3">
			<div class="card-title text-base-content/80 text-xl">
				<img src="/favicon.png" alt="logo" class="w-10" />
				Terima kasih telah menyelesaikan ujian online!
			</div>

			<div class="space-y-6 text-center">
				<div>
					<p class="text-xl font-semibold">Hasil Ujian Anda</p>
					<p class="text-lg">
						<strong class="text-info text-5xl"> {totalScore}</strong>
						dari {totalCategories * 100}
					</p>
				</div>

				<!-- Menampilkan hasil per kategori -->
				{#each categories as category}
					<div
						class="mt-4"
						class:text-primary={category.score >= category.passing}
						class:text-error={category.score < category.passing}
					>
						<p class="text-lg font-semibold">{category.name}</p>
						<p class="text-3xl">
							{category.score}
							<small class="text-base-content/50 text-lg">/ {category.passing}</small>
						</p>
					</div>
				{/each}
				<p class="underline">Anda dapat menutup aplikasi ini kapan saja.</p>
			</div>
		</div>
	</div>
</div>
