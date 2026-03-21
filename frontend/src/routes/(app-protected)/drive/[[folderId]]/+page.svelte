<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { ChevronRight, FileIcon} from '@lucide/svelte';
    import { driveService } from '$lib/services/driveService.svelte';
    import FolderRow from '$lib/components/FolderRow.svelte';
    import FileRow from '$lib/components/FileRow.svelte';
    import DriveTableHead from '$lib/components/DriveTableHead.svelte';
    import DriveBreadcrumbs from '$lib/components/DriveBreadcrumbs.svelte';
    import DriveItemActionsMenu from '$lib/components/DriveItemActionsMenu.svelte';
    import type { FolderResponse, FileResponse } from '$lib/api/contracts';
    import TextInputModal from '$lib/components/TextInputModal.svelte';

    let { data } = $props();

    let currentFolderId = $derived(page.params.folderId);
    let driveContentPromise = $derived(data.streamed.driveContent);

    // for DriveItemActionsMenu
    let menuOpen = $state(false);
    let menuTarget = $state<any>(null);
    let menuType = $state('folder');
    let menuPos = $state({ x: 0, y: 0 });

    function handleMenuOpen(e: MouseEvent, item: any, type: string) {
        e.preventDefault();
        menuPos = { x: e.clientX, y: e.clientY };
        menuTarget = item;
        menuType = type;
        menuOpen = true;
    }

    let isRenameModalOpen = $state(false);
    let renameTargetId = $state<number | null>(null);
    let renameItemType = $state<'file' | 'folder'>('folder');
    let fileExtensionTargetFile = $state<string | null>(null);

    async function handleItemMenuAction(action: string, item: FolderResponse | FileResponse) {
        const isFile = 'size' in item;

        switch(action) {
            case 'rename':
                renameTargetId = item.id;
                renameItemType = isFile ? 'file' : 'folder';
                fileExtensionTargetFile = isFile ? item.name.split('.').pop() || null : null;
                isRenameModalOpen = true;
                break;
            case 'delete':
                await driveService.deleteItem(item.id, isFile ? 'file' : 'folder');
                break;
            case 'download':
                if (isFile) await driveService.downloadFile(item.id, item.name);
                break;
        }
    }

    // Actions

    async function handleRename(newName: string) {
        await driveService.renameItem(
            newName,
            renameTargetId,
            renameItemType,
            fileExtensionTargetFile
        );
    }
</script>

<div class="h-full flex flex-col bg-transparent overflow-hidden">
    
    <header class="w-full px-8 h-20 flex items-center shrink-0 border-b border-white/5 bg-surface-950/20 backdrop-blur-sm">
        <nav aria-label="Breadcrumb">
            <ol class="flex items-center gap-3">
                {#await driveContentPromise}
                    <div class="flex items-center gap-2 animate-pulse">
                        <div class="w-24 h-4 bg-white/5 rounded-full"></div>
                        <ChevronRight size={14} class="opacity-20" />
                        <div class="w-32 h-4 bg-white/5 rounded-full"></div>
                    </div>
                {:then resolvedContent}
                    {#if resolvedContent}
                        <DriveBreadcrumbs path={resolvedContent.path} />
                    {/if}
                {/await}
            </ol>
        </nav>
    </header>

    <main class="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-surface-950/20">
        {#await driveContentPromise}
            <div class="w-full h-1 bg-primary-500/20 animate-pulse"></div>
        {:then resolvedContent}
            {#if resolvedContent && (resolvedContent.folders.length > 0 || resolvedContent.files.length > 0)}
                <div class="w-full" in:fade={{ duration: 100 }}>
                    <table class="w-full border-collapse table-fixed select-none">
                        <DriveTableHead />
                        <tbody class="bg-transparent">
                            {#each resolvedContent.folders as folder}
                                <FolderRow {folder} onRightClick={handleMenuOpen} />
                            {/each}
                            {#each resolvedContent.files as file}
                                <FileRow {file} onRightClick={handleMenuOpen} />            
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div class="h-full flex items-center justify-center opacity-20 text-[10px] uppercase tracking-widest">
                    Empty Folder
                </div>
            {/if}
        {/await}
    </main>

    <TextInputModal title="Rename Item" placeholder="Name" bind:open={isRenameModalOpen} onSubmit={handleRename} />
    <DriveItemActionsMenu 
        bind:open={menuOpen} 
        activeItem={menuTarget} 
        type={menuType} 
        pos={menuPos}
        onAction={(action: string, item: any) => handleItemMenuAction(action, item)} 
    />
</div>

<style>
    /* Scrollbar ultra-discret pentru zona de main */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
    }
</style>
