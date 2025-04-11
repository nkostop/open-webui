<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Exported prop
	export let size = 'md';

	// Counter in seconds
	let counter = 0;

	// Current index for colors array
	let currentColorIndex = 0;
	// Define three sets of color classes: (light mode / dark mode)
	const colors = [
		'bg-[#77F2A1] dark:bg-[#77F2A1]',
		'bg-[#00D69D] dark:bg-[#00D69D]',
		'bg-[#00BC8B] dark:bg-[#00BC8B]'
	];

	// Variable to store the interval ID
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			// Increase counter every second
			counter += 1;
			// Cycle through the colors array
			currentColorIndex = (currentColorIndex + 1) % colors.length;
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="w-full mt-2 mb-2">
	<!-- Display the counter value -->
	<p class="mb-2 font-mono text-gray-500 dark:text-gray-400">Thinking... {counter}s</p>
	<div class="animate-pulse flex w-full">
		<div class="{size === 'md' ? 'space-y-2' : 'space-y-1.5'} w-full">
			<div class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[currentColorIndex]} rounded-sm mr-14" />

			<div class="grid grid-cols-3 gap-4">
				<div
					class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[
						currentColorIndex
					]} rounded-sm col-span-2"
				/>
				<div
					class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[
						currentColorIndex
					]} rounded-sm col-span-1"
				/>
			</div>
			<div class="grid grid-cols-4 gap-4">
				<div
					class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[
						currentColorIndex
					]} rounded-sm col-span-1"
				/>
				<div
					class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[
						currentColorIndex
					]} rounded-sm col-span-2"
				/>
				<div
					class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[
						currentColorIndex
					]} rounded-sm col-span-1 mr-4"
				/>
			</div>

			<div class="{size === 'md' ? 'h-2' : 'h-1.5'} {colors[currentColorIndex]} rounded-sm" />
		</div>
	</div>
</div>
