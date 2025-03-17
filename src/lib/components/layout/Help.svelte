<script lang="ts">
	import { onMount, tick, getContext } from 'svelte';
	import {
		showBottomArtifacts,
		showControls,
		showArtifacts,
		showRightArtifacts,
		isFinishGenRes
	} from '$lib/stores';

	const i18n = getContext('i18n');

	import ShortcutsModal from '../chat/ShortcutsModal.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import HelpMenu from './Help/HelpMenu.svelte';

	let showShortcuts = false;
	console.log(111222, $showRightArtifacts);
</script>

<div class=" hidden lg:flex fixed bottom-0 right-0 px-1 py-1 z-20">
	<button
		id="show-shortcuts-button"
		class="hidden"
		on:click={() => {
			showShortcuts = !showShortcuts;
		}}
	/>
	{#if $isFinishGenRes}
		{#if !$showBottomArtifacts && !$showRightArtifacts}
			<Tooltip content={'BottomArtifacts'} placement="left">
				<button
					class=" flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px; color:transparent; background-color:transparent;"
					on:click={() => {
						showBottomArtifacts.set(true);
					}}
				>
					{'^'}
				</button>
			</Tooltip>
		{/if}
		{#if !$showBottomArtifacts && !$showRightArtifacts}
			<Tooltip content={'RightArtifacts'} placement="left">
				<button
					class=" flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px; color:transparent; background-color:transparent;"
					on:click={() => {
						showRightArtifacts.set(true);
					}}
				>
					{'>'}
				</button>
			</Tooltip>
		{/if}
		{#if $showBottomArtifacts || $showRightArtifacts}
			<Tooltip content={$i18n.t('Close')} placement="left">
				<button
					class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px;"
					on:click={() => {
						showBottomArtifacts.set(false);
						showRightArtifacts.set(false);
					}}
				>
					{'x'}
				</button>
			</Tooltip>
		{/if}
	{/if}
	<HelpMenu
		showDocsHandler={() => {
			showShortcuts = !showShortcuts;
		}}
		showShortcutsHandler={() => {
			showShortcuts = !showShortcuts;
		}}
	>
		<Tooltip content={$i18n.t('Help')} placement="left">
			<button
				class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-4 flex items-center justify-center text-[0.7rem] rounded-full"
			>
				?
			</button>
		</Tooltip>
	</HelpMenu>
</div>

<ShortcutsModal bind:show={showShortcuts} />
