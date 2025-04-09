<script lang="ts">
	import { goto } from '$app/navigation';
	import { api, app, delay } from '$lib/app';

	let form = $state({
		identity: '',
		password: ''
	});

	async function login() {
		await api.from('users').authWithPassword(form);
		// console.log(api.auth);
		goto('/app');
	}

	async function loginWithSSO() {
		await api.from('users').authWithOauth2('github', {
			redirectTo: `${location.origin}/main`
		});
	}
	$effect(() => {});
</script>

<div class="bg-base-200 flex h-screen items-center justify-center">
	<div class="bg-base-100 rounded-box p-5 shadow">
		<form onsubmit={login} class="flex min-w-sm flex-col gap-5">
			<img src="/favicon.png" alt="logo" class="w-10" />
			<p>Masuk untuk melanjutkan</p>
			<label class="label floating-label">
				<span>Email</span>
				<input type="email" class="input w-full" placeholder="Email" bind:value={form.identity} />
			</label>
			<label class="label floating-label">
				<span>Password</span>
				<input
					type="password"
					class="input w-full"
					placeholder="Password"
					bind:value={form.password}
				/>
			</label>
			<a href="/auth/forgot_password" class="text-base-600 text-sm">Forgotten Password?</a>
			<button type="submit" class="btn btn-secondary" disabled={app.loading}>
				<span class:loading={app.loading}></span>
				Masuk
			</button>
			<div class="divider my-0">Atau</div>
			<button type="button" class="btn btn-primary" onclick={loginWithSSO}>
				<img src="/favicon.png" alt="SSO" class="h-8" />
				Masuk Dengan SSO
			</button>
			<!-- <a href="/api/collections/users/auth-with-oauth2/github" class="btn btn-primary">
				<img src="/favicon.png" alt="SSO" class="h-8" />
				Masuk Dengan SSO
			</a> -->
		</form>
	</div>
</div>
