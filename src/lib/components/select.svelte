<script lang="ts">
	import { api } from '$lib/app';
	import Svelecte from 'svelecte';
	import { dndzone } from 'svelte-dnd-action';
	import type { ComponentProps } from 'svelte';
	type SvelecteProps = ComponentProps<typeof Svelecte>;

	let el = $state();
	let {
		value = $bindable(),
		fetch: fetchValue,
		autofocus,
		...restProps
	}: SvelecteProps & { autofocus?: boolean } = $props();

	let fetch = $derived(
		fetchValue?.includes('http') ? fetchValue : api.buildUrl(`/api/collections${fetchValue}`)
	);
	let fetchProps: RequestInit = $state({});
	$effect(() => {
		if (localStorage.pocketbase_auth) {
			const token = localStorage.access_token;
			fetchProps.headers = {
				Authorization: token
			};
		}

		// $inspect(fetchProps);
		if (autofocus && el instanceof HTMLElement) {
			(el.querySelector('input.sv-input--text') as HTMLInputElement)?.focus();
		}
	});
</script>

<div bind:this={el} class="label floating-label">
	<span>{restProps.placeholder}</span>
	{#if fetchValue}
		<Svelecte
			bind:value
			{dndzone}
			{fetch}
			{fetchProps}
			{...restProps}
			class={`input mb-2 ${restProps.class ?? ''}`}
		/>
	{:else}
		<Svelecte bind:value {dndzone} {...restProps} class={`input mb-2  ${restProps.class ?? ''}`} />
	{/if}
</div>

<style>
	:global(.floating-label > span) {
		z-index: 2;
	}
	:global(:root) {
		--sv-dropdown-width: 100%;
		--sv-dropdown-offset: 5px;
		--sv-dropdown-bg: oklch(var(--b1));
		--sv-border-radius: var(--rounded-box);
		--sv-selection-gap: 0;
		--sv-general-padding: 0;
	}
	:global(.svelecte) {
		width: 100%;
		z-index: 1;
		padding: 0;
	}
	:global(.sv-control) {
		margin: auto 6px;
		background: transparent !important;
		border: none !important;
		width: 100%;
	}
	:global(.sv_dropdown) {
		top: 100%;
	}
	:global(.sv_dropdown.is-open) {
		z-index: 5 !important;
	}
	/* :global(.sv-control input::placeholder) {
		font-size: 80%;
		color: transparent;
	} */
</style>
