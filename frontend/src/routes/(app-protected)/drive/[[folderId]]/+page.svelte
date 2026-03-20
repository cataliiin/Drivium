<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { ChevronRight} from '@lucide/svelte';
    import { driveService } from '$lib/services/driveService.svelte';
    import FolderRow from '$lib/components/FolderRow.svelte';
    import FileRow from '$lib/components/FileRow.svelte';
    import DriveTableHead from '$lib/components/DriveTableHead.svelte';
    import DriveBreadcrumbs from '$lib/components/DriveBreadcrumbs.svelte';
    import DriveLoadingPlaceholder from '$lib/components/DriveLoadingPlaceholder.svelte';
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

<div class="h-screen flex flex-col bg-surface-50-950 overflow-hidden font-sans text-surface-900-50">
    
    <header class="w-full px-6 h-16 flex items-center gap-4 shrink-0 z-10 border-b border-surface-500/10">
        <nav aria-label="Breadcrumb" class="flex-1">
            <ol class="flex items-center gap-2 text-sm">
                {#await driveContentPromise}
                    <li class="flex items-center gap-2 animate-pulse list-none">
                        <div class="placeholder w-20 h-4 rounded-full"></div>
                        <ChevronRight class="size-4 opacity-20" />
                        <div class="placeholder w-32 h-4 rounded-full opacity-60"></div>
                    </li>
                {:then resolvedContent}
                    {#if resolvedContent}
                        <DriveBreadcrumbs path={resolvedContent.path} />
                    {/if}
                {/await}
            </ol>
        </nav>

        
    </header>

    <main class="flex-1 overflow-y-auto px-4">
        {#await driveContentPromise}
            <DriveLoadingPlaceholder />
        {:then resolvedContent}
            {#if resolvedContent && (resolvedContent.folders.length > 0 || resolvedContent.files.length > 0)}
                <div class="table-wrap py-3" in:fade={{ duration: 200 }}>
                    <table class="table table-fixed w-full border-collapse">
                        <DriveTableHead />
                        <tbody class="[&>tr]:hover:preset-tonal-primary transition-colors cursor-pointer border-separate">
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
                {#if currentFolderId === undefined}
                    <div class="p-10 text-center opacity-50">Your drive is empty</div>
                {:else}
                <div class="p-10 text-center opacity-50">This folder is empty</div>
                {/if}
            {/if}
        {:catch error}
            <div class="p-10 text-center text-error-500 font-semibold">
                {error.message || 'Error loading drive content'}
            </div>
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
    .table-wrap {
        width: 100%;
    }
    table {
        table-layout: fixed;
    }
</style>