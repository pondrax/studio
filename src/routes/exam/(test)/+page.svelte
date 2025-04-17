<script lang="ts">
	import { goto } from '$app/navigation';
	import { api, app, delay } from '$lib/app';

	let form = $state({
		identity: '',
		password: '',
		batch: ''
	});

	function login(e: SubmitEvent) {
		e.preventDefault();
		// await api.from('users').authWithPassword(form);
		// console.log(api.auth);
		goto('/exam/agreement');
	}
	$effect(() => {});
</script>

<div class="bg-base-200 flex h-screen items-center justify-center">
	<div class="card bg-base-100 w-full max-w-sm shadow">
		<form onsubmit={login} class="card-body space-y-3">
			<div class="card-title text-base-content/80 text-xl">
				<img src="/favicon.png" alt="logo" class="w-10" />
				Ujian Online
			</div>
			<p>Masuk untuk melanjutkan</p>
			<label class=" floating-label">
				<span>Username / Email</span>
				<input
					type="text"
					class="input w-full"
					placeholder="Username / Email"
					bind:value={form.identity}
				/>
			</label>

			<label class="floating-label">
				<span>Kode Batch</span>
				<input type="text" class="input w-full" placeholder="Kode Batch" bind:value={form.batch} />
			</label>

			<label class=" floating-label">
				<span>Password</span>
				<input
					type="password"
					class="input w-full"
					placeholder="Password"
					bind:value={form.password}
				/>
			</label>
			<button type="submit" class="btn btn-secondary" disabled={app.loading}>
				<span class:loading={app.loading}></span>
				<iconify-icon icon="bx:log-in"></iconify-icon>
				Masuk
			</button>
		</form>
		<!-- </form> -->
	</div>
</div>
