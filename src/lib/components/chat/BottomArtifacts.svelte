<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	const i18n = getContext('i18n');
	const dispatch = createEventDispatcher();

	import { showBottomArtifacts, isFinishGenRes, bottomHistory } from '$lib/stores';
	import XMark from '../icons/XMark.svelte';
	import { copyToClipboard, createMessagesList } from '$lib/utils';
	import ArrowsPointingOut from '../icons/ArrowsPointingOut.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import SvgPanZoom from '../common/SVGPanZoom.svelte';
	import ArrowLeft from '../icons/ArrowLeft.svelte';

	export let overlay = false;
	let messages = [];

	let contents = '';
	let selectedContentIdx = 0;

	let copied = false;

	onMount(() => {
		contents = $bottomHistory;
	});

	$: {
		if (!$bottomHistory) {
			showBottomArtifacts.set(false);
		}
	}

	const submitHref = (e: Event) => {
		const chatInput = document.getElementById('chat-input');
		if (chatInput) {
			let textToSet = `${e.target.innerHTML.toString()}`;
			chatInput.innerHTML = textToSet; // Set the innerHTML directly
			setTimeout(() => {
				document.getElementById('send-message-button')?.click();
			}, 400);
		}
	};

	// Inject event listeners to dynamically rendered HTML content
	onMount(() => {
		// After content is rendered, add event listeners
		const bottomArtifact = document.getElementById('BottomArtifact');
		if (bottomArtifact) {
			const links = bottomArtifact.querySelectorAll(
				'a, tr, td, .nbg__button, .nbg__button__primary, .nbg__button__secondary, .nbg__button__danger, .nbg__button__icon, .nbg__button__primary__no__fill, .nbg__button__secondary__no__fill, .nbg__button__text__link, .nbg__button__copy, .nbg__button__sidebar, .nbg__cta__arrow, .nbg__cta__rounded, .nbg__support__cta__arrow, .nbg__blog__cta__button, .nbg__feature__card__button, .nbg__advantage__card__tag '
			); // Select all links inside BottomArtifact
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					if ($isFinishGenRes) {
						submitHref(e); // Trigger the function when a link is clicked
					}
				});
			});
		}
	});
	$: {
		const bottomArtifact = document.getElementById('BottomArtifact');
		if (bottomArtifact) {
			const links = bottomArtifact.querySelectorAll('a'); // Select all links inside BottomArtifact
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					if ($bottomHistory.messages[$bottomHistory.currentId].done) {
						submitHref(e); // Trigger the function when a link is clicked
					}
				});
			});
		}
	}
</script>

<div
	id="bottom-artifact"
	class="absolute bg-gray-950 z-50 w-full max-w-full flex flex-col rounded-md shadow-lg"
	style="bottom:5px;left:5px;right:15px;height:220px;overflow-y:auto;padding: 6px;transition: all 0.3s ease-in-out;"
>
	<div class="relative flex flex-col" style="">
		<div class="w-full h-full flex-1 relative">
			{#if overlay}
				<div class="absolute top-0 left-0 right-0 bottom-0 z-10"></div>
			{/if}

			<div class="absolute pointer-events-none z-50 w-full flex items-center justify-start p-4">
				<button
					class="self-center pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-850"
					on:click={() => {
						showBottomArtifacts.set(false);
					}}
				>
					<ArrowLeft className="size-3.5 text-gray-900 dark:text-white" />
				</button>
			</div>

			<div class="absolute pointer-events-none z-50 w-full flex items-center justify-end p-4">
				<button
					class="self-center pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-850"
					on:click={() => {
						dispatch('close');
						showBottomArtifacts.set(false);
					}}
				>
					<XMark className="size-3.5 text-gray-900 dark:text-white" />
				</button>
			</div>

			<div class="flex-1 w-full h-full">
				<div class="h-full flex flex-col">
					{#if contents.length > 0 && $bottomHistory}
						<div
							class="max-w-full w-full h-full"
							role="button"
							tabindex="0"
							on:click={(e) => {
								submitHref(e);
							}}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									dispatch('submit', 'xaxa');
								}
							}}
						>
							{@html $bottomHistory}
						</div>
					{:else}
						<div class="m-auto font-medium text-xs text-gray-900 dark:text-white">
							{$i18n.t('No HTML, CSS, or JavaScript content found.')}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
