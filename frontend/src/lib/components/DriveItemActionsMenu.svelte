<script lang="ts">
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Trash2, Edit2, Download } from '@lucide/svelte';

	let { 
		open = $bindable(false), 
		activeItem, 
		type,
        pos = { x: 0, y: 0 },
		onAction
	} = $props();

	const MENU_WIDTH = 200; 
	const MENU_HEIGHT = 250;

	const overflowRight = $derived(pos.x + MENU_WIDTH > window.innerWidth);
	const overflowBottom = $derived(pos.y + MENU_HEIGHT > window.innerHeight);

	const transformClass = $derived(`
		${overflowRight ? '-translate-x-full' : 'translate-x-0'} 
		${overflowBottom ? '-translate-y-full' : 'translate-y-0'}
	`);

	function triggerAction(action: string) {
		onAction(action, activeItem);
		open = false; 
	}
</script>

<Menu {open} onOpenChange={(e) => (open = e.open)}>
	<Portal>
		<Menu.Positioner class="transition-transform ease-out duration-200 {transformClass}" style="position: fixed; left: {pos.x}px; top: {pos.y}px; z-index: 9999;">
			<Menu.Content>
				<Menu.Item value="rename" onclick={() => triggerAction('rename')}>
					<Edit2 class="size-4" />
					<span class="text-sm">Rename</span>
				</Menu.Item>

				{#if type === 'file'}
					<Menu.Item value="download" onclick={() => triggerAction('download')} >
						<Download class="size-4" />
						<span class="text-sm">Download</span>
					</Menu.Item>
				{/if}

				<div class="h-[1px] bg-surface-500/10 my-1"></div>

				<Menu.Item value="delete" onclick={() => triggerAction('delete')} >
					<Trash2 class="size-4" />
					<span class="text-sm font-medium">Delete</span>
				</Menu.Item>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>