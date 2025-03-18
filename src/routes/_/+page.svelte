<div class="flex h-screen items-center justify-center">
	<form class="bg-base-200 rounded-box flex w-sm flex-col gap-5 p-5 shadow">
		<img src="/favicon.png" alt="logo" class="w-10" />
		<p>Admin Sign In</p>
		<label class="label floating-label">
			<span>Email</span>
			<input type="email" class="input w-full" placeholder="Email" />
		</label>
		<label class="label floating-label">
			<span>Password</span>
			<input type="password" class="input w-full" placeholder="Password" />
		</label>
		<a href="/_/auth/forgot_password" class="text-base-600 text-sm">Forgotten Password?</a>
		<button type="submit" class="btn btn-primary bg-primary-500 w-full text-white">Login</button>
	</form>
</div>
