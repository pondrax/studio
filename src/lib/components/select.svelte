<script lang="ts">
	import { api } from '$lib/app';
	import Svelecte from 'svelecte';
	import { dndzone } from 'svelte-dnd-action';
	import type { ComponentProps } from 'svelte';
	type SvelecteProps = ComponentProps<typeof Svelecte>;

	let el = $state();
	let focus = $state(false);
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
			focus = true;
			(el.querySelector('input.sv-input--text') as HTMLInputElement)?.focus();
		}
	});
</script>

<div bind:this={el} class="floating-label relative">
	<span class:focus={value}>{restProps.placeholder}</span>
	<div
		class="border-base-content/20 w-full rounded border p-0 ring-offset-2"
		class:ring-2={focus}
		class:border-base-content={focus}
	>
		{#if fetchValue}
			<!-- {dndzone} -->
			<Svelecte
				bind:value
				{fetch}
				{fetchProps}
				{...restProps}
				selectOnTab={true}
				class=""
				onFocus={() => (focus = true)}
				onBlur={() => (focus = false)}
			/>
		{:else}
			<Svelecte
				bind:value
				{dndzone}
				{...restProps}
				onFocus={() => (focus = true)}
				onBlur={() => (focus = false)}
			/>
		{/if}
	</div>
</div>

<style>
	:global(.floating-label > span.focus) {
		opacity: 100%;
		top: 0;
		translate: -12.5% calc(-50% - 0.125em);
		scale: 0.75;
		pointer-events: auto;
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
		font-size: 80%;
		/* z-index: 0; */
		padding: 2px 15px 2px 0;
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
	:global(.sv-control--selection) {
		gap: 5px !important;
	}
	/* :global(.sv_dropdown.is-open) {
		z-index: 5 !important;
	} */
	/* :global(.sv-control input::placeholder) {
		font-size: 80%;
		color: transparent;
	} */
</style>
