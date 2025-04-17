<script lang="ts">
	import { goto } from '$app/navigation';
	import { d, api } from '$lib/app';

	type Collections = Awaited<ReturnType<typeof getCollections>>;
	type Item = Collections['items'][number];

	let collections: Collections | undefined = $state();
	let query = $state({
		perPage: 100,
		sort: '@random'
	});
	async function getCollections() {
		let result = await api.from('questions').getList(query);
		result = {
			...result,
			items: result.items.map((item) => ({
				...item,
				options: item.options
			}))
		};
		return result;
	}

	let questions = $derived(collections?.items || []);
	let answers: Record<string, string>[] = $state([]);
	let currentQuestionIndex = $state(0);
	let currentTime = $state(d());
	let countdownTime = $state(30 * 60); // 30 menit dalam detik

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	}

	// Ambil data awal + timer
	$effect(() => {
		(async () => {
			collections = await getCollections();
		})();

		const interval = setInterval(() => {
			currentTime = d();
			if (countdownTime > 0) {
				countdownTime--;
			} else {
				clearInterval(interval);
				finishExam();
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	// Update/initialize answers tiap questions berubah
	$effect(() => {
		if (questions.length) {
			answers = questions.map((q) => ({
				id: q.id,
				answer: ''
			}));
		}
	});

	function finishExam() {
		goto('/exam/result');
	}

	function selectAnswer(questionIndex: number, choice: string) {
		answers[questionIndex].answer = choice;
		answers = [...answers]; // trigger reactive update
	}
</script>

<div class="bg-base-200 flex h-screen flex-col">
	<!-- Header -->
	<div class="navbar bg-base-100 min-h-0 pr-15 shadow-sm">
		<div class="flex-none">
			<img src="/favicon.png" alt="logo" class="w-10" />
		</div>
		<div class="flex-1">
			<button class="btn btn-ghost">[Username] / [Position] / [BatchID]</button>
		</div>
		<div class="flex-none">
			<button class="btn btn-sm btn-ghost">{currentTime.format('DD MMMM, HH:mm:ss')}</button>
			<button class="btn btn-sm btn-error">{formatTime(countdownTime)}</button>
		</div>
	</div>

	<!-- Main exam container -->
	<main class="flex flex-1 gap-5 p-5">
		<!-- Card for displaying questions -->
		<div class="flex grow items-center justify-center">
			<div class="card bg-base-100 min-h-125 w-full max-w-5xl shadow">
				<div class="card-body space-y-3">
					<div class="flex flex-1 flex-col gap-5">
						{#if questions.length}
							<div class="text-lg">{questions[currentQuestionIndex].question}</div>

							<div class="flex flex-col gap-3">
								{#each Object.entries(questions[currentQuestionIndex].options).sort(() => Math.random() - 0.5) as [key, option]}
									<label
										class="label hover:bg-base-200 w-full cursor-pointer rounded-xl p-2 ring-2"
									>
										<input
											type="radio"
											name="answer-{questions[currentQuestionIndex].id}"
											value={key}
											class="radio radio-primary"
											onchange={() => selectAnswer(currentQuestionIndex, key)}
											checked={answers[currentQuestionIndex]?.answer === key}
										/>
										<span class="label-text ml-2">{key.toUpperCase()}. {option}</span>
									</label>
								{/each}
							</div>

							<div class="mt-auto flex justify-between">
								<button
									onclick={() => (currentQuestionIndex = Math.max(currentQuestionIndex - 1, 0))}
									class="btn btn-secondary"
									disabled={currentQuestionIndex === 0}
								>
									Sebelumnya
								</button>
								<button
									onclick={() =>
										(currentQuestionIndex = Math.min(
											currentQuestionIndex + 1,
											questions.length - 1
										))}
									class="btn btn-secondary"
									disabled={currentQuestionIndex === questions.length - 1}
								>
									Selanjutnya
								</button>
							</div>
						{:else}
							<p class="text-center text-gray-500">Memuat soal...</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="flex h-full w-64 flex-col justify-start gap-5">
			<div>
				<button onclick={finishExam} class="btn btn-error w-full">Selesai</button>
			</div>
			<div class="grid grid-cols-5 gap-2">
				{#each questions as _, index}
					<button
						class="btn btn-sm ring"
						class:btn-primary={index === currentQuestionIndex}
						class:btn-success={answers[index]?.answer}
						onclick={() => (currentQuestionIndex = index)}
					>
						{index + 1}
					</button>
				{/each}
			</div>
			<div class="bg-base-300 mt-auto h-40 rounded border border-dashed ring-2">
				Camera Live Feed
			</div>
		</div>
	</main>
</div>
