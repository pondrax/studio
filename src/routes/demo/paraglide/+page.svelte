<script lang="ts">
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div class="flex gap-2">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
