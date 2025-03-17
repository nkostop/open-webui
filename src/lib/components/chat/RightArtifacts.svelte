<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	const i18n = getContext('i18n');
	const dispatch = createEventDispatcher();

	import { showRightArtifacts, showSidebar, rightHistory } from '$lib/stores';
	import XMark from '../icons/XMark.svelte';
	import { copyToClipboard, createMessagesList } from '$lib/utils';
	import ArrowsPointingOut from '../icons/ArrowsPointingOut.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import SvgPanZoom from '../common/SVGPanZoom.svelte';
	import ArrowLeft from '../icons/ArrowLeft.svelte';

	export let overlay = false;
	let messages = [];
	let leftPx = '10px';

	let contents: Array<{ type: string; content: string }> = [];
	let selectedContentIdx = 0;

	let copied = false;

	onMount(() => {});

	$: if ($rightHistory) {
		messages = createMessagesList($rightHistory, $rightHistory.currentId);
		getContents();
	} else {
		messages = [];
		getContents();
	}

	console.log({ $rightHistory });

	const getContents = () => {
		contents = [];
		messages.forEach((message) => {
			console.log(6666, message?.content);
			if (message?.role !== 'user' && message?.content) {
				const codeBlockContents = message.content.match(/```[\s\S]*?```/g);
				let codeBlocks = [];

				if (codeBlockContents) {
					codeBlockContents.forEach((block) => {
						const lang = block.split('\n')[0].replace('```', '').trim().toLowerCase();
						const code = block.replace(/```[\s\S]*?\n/, '').replace(/```$/, '');
						codeBlocks.push({ lang, code });
					});
				}

				let htmlContent = '';
				let cssContent = '';
				let jsContent = '';

				codeBlocks.forEach((block) => {
					const { lang, code } = block;

					if (lang === 'html') {
						htmlContent += code + '\n';
					} else if (lang === 'css') {
						cssContent += code + '\n';
					} else if (lang === 'javascript' || lang === 'js') {
						jsContent += code + '\n';
					}
				});

				const inlineHtml = message.content.match(/<html>[\s\S]*?<\/html>/gi);
				const inlineCss = message.content.match(/<style>[\s\S]*?<\/style>/gi);
				const inlineJs = message.content.match(/<script>[\s\S]*?<\/script>/gi);

				if (inlineHtml) {
					inlineHtml.forEach((block) => {
						const content = block.replace(/<\/?html>/gi, ''); // Remove <html> tags
						htmlContent += content + '\n';
					});
				}
				if (inlineCss) {
					inlineCss.forEach((block) => {
						const content = block.replace(/<\/?style>/gi, ''); // Remove <style> tags
						cssContent += content + '\n';
					});
				}
				if (inlineJs) {
					inlineJs.forEach((block) => {
						const content = block.replace(/<\/?script>/gi, ''); // Remove <script> tags
						jsContent += content + '\n';
					});
				}

				if (htmlContent || cssContent || jsContent) {
					const renderedContent = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
							<${''}style>
								${cssContent}
							</${''}style>
                        </head>
                        <body>
                            ${htmlContent}

							<${''}script>
                            	${jsContent}
							</${''}script>
                        </body>
                        </html>
                    `;
					contents = [...contents, { type: 'web', content: renderedContent }];
				} else {
					// Check for SVG content
					for (const block of codeBlocks) {
						if (block.lang === 'svg' || (block.lang === 'xml' && block.code.includes('<svg'))) {
							contents = [...contents, { type: 'svg', content: block.code }];
						}
					}
				}
			}
		});

		if (contents.length === 0) {
			showRightArtifacts.set(false);
			showRightArtifacts.set(false);
		}

		selectedContentIdx = contents ? contents.length - 1 : 0;
	};

	function navigateContent(direction: 'prev' | 'next') {
		selectedContentIdx =
			direction === 'prev'
				? Math.max(selectedContentIdx - 1, 0)
				: Math.min(selectedContentIdx + 1, contents.length - 1);
	}

	const submitHref = (e: Event) => {
		const chatInput = document.getElementById('chat-input');
		if (chatInput) {
			let textToSet = `Give me more information about: "${e.target.innerHTML.toString()}".`;
			chatInput.innerHTML = textToSet; // Set the innerHTML directly
			setTimeout(() => {
				document.getElementById('send-message-button')?.click();
			}, 400);
		}
	};

	function copyContent() {
		if (contents[selectedContentIdx]?.content) {
			copyToClipboard(contents[selectedContentIdx].content);
			copied = true;
			toast.success('Copied to clipboard');
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	onMount(() => {
		// Update container lookup to use 'RightArtifact'
		document.getElementById('RightArtifact')?.scrollIntoView({ behavior: 'smooth' });
	});

	// Inject event listeners to dynamically rendered HTML content
	onMount(() => {
		// After content is rendered, add event listeners
		const artifact = document.getElementById('RightArtifact');
		if (artifact) {
			const links = artifact.querySelectorAll('a');
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					if ($rightHistory.messages[$rightHistory.currentId].done) {
						submitHref(e);
					}
				});
			});
		}
	});
	$: {
		const artifact = document.getElementById('RightArtifact');
		if (artifact) {
			const links = artifact.querySelectorAll('a');
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					if ($rightHistory.messages[$rightHistory.currentId].done) {
						submitHref(e);
					}
				});
			});
		}
	}

	$: {
		if ($showSidebar) {
			leftPx = '260px';
		} else {
			leftPx = '4px';
		}
	}
</script>

<!-- Update the container div -->
<div
	style="position: absolute; bottom: 4px; right: 4px; max-height: 100svh; max-width: 440px; width: 100%; overflow-y: auto; z-index: 20; padding: 12px; padding-bottom: 24px; color: #2f2f2f; background-color: var(--color-light, #cdcdcd); display: flex; flex-direction: column; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
>
	<div class="relative flex flex-col">
		<div class="w-full h-full flex-1 relative">
			{#if overlay}
				<div class="absolute top-0 left-0 right-0 z-10"></div>
			{/if}

			<div
				class="pointer-events-none z-50 w-full flex items-center justify-end p-4"
				style="position: fixed; top: 40px; right: 35px; z-index: 1000;"
			>
				<button
					class="self-center pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-850"
					on:click={copyContent}
					title="Copy to clipboard"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.3"
						stroke="#fff"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
						/>
					</svg>
				</button>
			</div>
			<div
				class="pointer-events-none z-50 w-full flex items-center justify-end p-4"
				style="position: fixed; top: 40px; right: 10px; z-index: 1000;"
			>
				<button
					class="self-center pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-850"
					on:click={() => {
						dispatch('close');
						showRightArtifacts.set(false);
					}}
				>
					<XMark className="size-3.5 text-gray-900 dark:text-white" />
				</button>
			</div>

			<div class="flex-1 w-full h-full">
				<div class="flex flex-col" style="height: 93svh;">
					{#if contents.length > 0}
						<div
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
							{#if contents[selectedContentIdx].type === 'web'}
								{@html `${contents[selectedContentIdx].content}`}
							{:else if contents[selectedContentIdx].type === 'svg'}
								<SvgPanZoom
									className="w-full h-full max-h-full overflow-hidden"
									svg={contents[selectedContentIdx].content}
								/>
							{/if}
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
