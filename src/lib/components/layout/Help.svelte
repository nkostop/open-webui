<script lang="ts">
	import { onMount, tick, getContext } from 'svelte';
	import {
		showBottomArtifacts,
		showControls,
		showArtifacts,
		showLeftArtifacts,
		isFinishGenRes
	} from '$lib/stores';

	const i18n = getContext('i18n');

	import ShortcutsModal from '../chat/ShortcutsModal.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import HelpMenu from './Help/HelpMenu.svelte';

	let showShortcuts = false;
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
		{#if !$showArtifacts && !$showBottomArtifacts && !$showLeftArtifacts}
			<Tooltip content={$i18n.t('Artifacts')} placement="left">
				<button
					class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px;"
					on:click={() => {
						showLeftArtifacts.set(!$showLeftArtifacts);
					}}
				>
					{'<'}
				</button>
			</Tooltip>
		{/if}
		{#if !$showBottomArtifacts && !$showArtifacts && !$showLeftArtifacts}
			<Tooltip content={$i18n.t('Artifacts')} placement="left">
				<button
					class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px;"
					on:click={() => {
						showBottomArtifacts.set(!$showBottomArtifacts);
					}}
				>
					{'^'}
				</button>
			</Tooltip>
		{/if}
		{#if !$showArtifacts && !$showBottomArtifacts && !$showLeftArtifacts}
			<Tooltip content={$i18n.t('Artifacts')} placement="left">
				<button
					class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px;"
					on:click={() => {
						showControls.set(!$showControls);
						showArtifacts.set(!$showArtifacts);
					}}
				>
					{'>'}
				</button>
			</Tooltip>
		{/if}
		{#if $showArtifacts || $showBottomArtifacts || $showLeftArtifacts || $showControls}
			<Tooltip content={$i18n.t('Close')} placement="left">
				<button
					class="text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full"
					style="margin-right: 4px;"
					on:click={() => {
						showControls.set(false);
						showArtifacts.set(false);
						showBottomArtifacts.set(false);
						showLeftArtifacts.set(false);
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
