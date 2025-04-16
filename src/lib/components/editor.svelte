<script lang="ts">
	import { onMount } from 'svelte';

	let { value = $bindable(), placeholder = '' } = $props();
	let editor: HTMLElement;

	const toolbarOptions = [
		[{ header: 1 }, { header: 2 }, 'blockquote', 'link', 'image', 'video'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'ordered' }],
		[{ align: [] }],
		['clean']
	];

	onMount(async () => {
		const { default: Quill } = await import('quill');
		let quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder
		});
		quill.root.innerHTML = value ?? '';
		quill.on('text-change', () => {
			value = quill.root.innerHTML;
		});
	});
</script>

<div class="editor-wrapper">
	<div bind:this={editor}></div>
</div>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
