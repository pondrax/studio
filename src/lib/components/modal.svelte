<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet<[T]>;
		action?: Snippet<[T]>;
		title: string;
		data?: T;
	};
	let { children, action, title, data = $bindable() }: Props = $props();

	function handleClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			data = undefined;
		}
	}

	$effect(() => {
		if (data) {
			const focusElement = document.querySelector('[data-autofocus]');
			// console.log(focusElement, document.activeElement);
			if (focusElement instanceof HTMLInputElement) {
				setTimeout(() => focusElement.focus(), 100);
			}
		}
	});
</script>

<svelte:window onkeydown={handleClose} />

{#if data}
	<dialog class="modal modal-open">
		<div class="modal-box relative w-11/12 max-w-xl">
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute top-4 right-2"
					onclick={() => (data = undefined)}
				>
					✕
				</button>
			</form>
			<h3 class="text-lg font-bold">{title}</h3>
			{@render children?.(data)}
			<div class="modal-action mt-0 justify-start p-0">
				{@render action?.(data)}
			</div>
		</div>
	</dialog>
{/if}
