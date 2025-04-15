<script lang="ts">
	let { data = '', mask = $bindable(true), length = 3 } = $props();

	let maskedValue = $derived(
		data.includes('@')
			? data.replace(/^[^@]+/, (m) => m.replace(/./g, '*'))
			: data.replace(new RegExp(`[^_\\- ](?=.{${length}})`, 'g'), '*')
	);
</script>

<div>
	{#if mask}
		{maskedValue}
	{:else}
		{data}
	{/if}
	<button
		type="button"
		class="btn btn-soft btn-xs"
		aria-label="mask"
		onclick={() => {
			mask = !mask;
		}}
	>
		{#if mask}
			<iconify-icon icon="bx:show"></iconify-icon>
		{:else}
			<iconify-icon icon="bx:hide"></iconify-icon>
		{/if}
	</button>
</div>
