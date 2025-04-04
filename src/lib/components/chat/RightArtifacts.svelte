<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount, getContext, createEventDispatcher, onDestroy } from 'svelte';
	const i18n = getContext('i18n');
	import { jsPDF } from 'jspdf';
	const dispatch = createEventDispatcher();

	import { showRightArtifacts, rightHistory } from '$lib/stores';
	import { copyToClipboard } from '$lib/utils';

	export let overlay = false;

	let contents = '';
	let selectedContentIdx = '';

	let copied = false;

	onMount(() => {
		contents = $rightHistory;
	});

	$: {
		if (!$rightHistory) {
			showRightArtifacts.set(false);
		}
	}

	function copyContent() {
		const renderedDiv = document.getElementById('rendered-outcome');
		if (renderedDiv) {
			copyToClipboard(renderedDiv.innerText);
			copied = true;
			toast.success('Copied to clipboard');
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	function downloadPdf() {
		const renderedDiv = document.getElementById('rendered-outcome');
		if (renderedDiv) {
			const doc = new jsPDF('p', 'pt', 'a4');
			doc.html(renderedDiv, {
				callback: function (doc) {
					doc.save('NBG_ARTICLE.pdf');
				},
				x: 10,
				y: 10
			});
		} else {
			toast.error('No content available to export');
		}
	}

	onDestroy(() => {
		showRightArtifacts.set(false);
	});
</script>

<!-- Update the container div -->
<div
	style="width: 100%; height: 100%; overflow-y: auto; z-index: 20; padding: 12px; padding-bottom: 24px; color: #2f2f2f; background-color: var(--color-light, #cdcdcd); display: flex; flex-direction: column; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
>
	<div class="relative flex flex-col" style="height: 100%;">
		<div class="w-full h-full flex-1 relative">
			{#if overlay}
				<div class="absolute top-0 left-0 right-0"></div>
			{/if}

			<!-- Changed from fixed positioning to relative positioning -->
			<div
				class="pointer-events-none z-50 w-full flex items-center justify-end p-4"
				style="position: fixed; top: 40px; right: 5px;"
			>
				<button
					class="self-center pointer-events-auto p-1 rounded-full border border-gray-300 dark:border-gray-700"
					on:click={copyContent}
					title="Copy to clipboard"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.3"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
						/>
					</svg>
				</button>
				<button
					class="self-center pointer-events-auto p-1 ml-2 rounded-full border border-gray-300 dark:border-gray-700"
					on:click={downloadPdf}
					title="Download as PDF"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.3"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v12m0 0l-4-4m4 4l4-4"
						/>
					</svg>
				</button>
				<button
					class="self-center pointer-events-auto p-1 ml-2 rounded-full border border-gray-300 dark:border-gray-700"
					on:click={() => {
						showRightArtifacts.set(false);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.3"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="flex-1 w-full h-full">
				<div class="flex flex-col" style="height: 100%;">
					{#if contents.length > 0 && $rightHistory}
						<div
							id="rendered-outcome"
							class="max-w-full w-full h-full"
							style="padding-top: 40px"
							role="button"
							tabindex="0"
							on:click={() => {
								dispatch('submit', 'xaxa');
							}}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									dispatch('submit', 'xaxa');
								}
							}}
						>
							{@html $rightHistory
								?.split('Assistant_Response:')[0]
								?.split('OpenBottomArtifactsStart')[0]}
						</div>
					{:else}
						<div class="m-auto font-medium text-xs text-gray-900 dark:text-white">
							{$i18n.t('No content found.')}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
