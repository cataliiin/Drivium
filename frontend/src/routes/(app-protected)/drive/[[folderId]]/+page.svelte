<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { Plus, ChevronRight} from '@lucide/svelte';
    import type { FolderContentResponse } from '$lib/api/contracts';
    import { listContentRoot, listContentFolder, createFolder, renameFile, deleteFile, renameFolder, deleteFolder } from '$lib/api/drive';
    import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import FolderRow from '$lib/components/FolderRow.svelte';
    import FileRow from '$lib/components/FileRow.svelte';
	import DriveTableHead from '$lib/components/DriveTableHead.svelte';
	import DriveBreadcrumbs from '$lib/components/DriveBreadcrumbs.svelte';
    import DriveLoadingPlaceholder from '$lib/components/DriveLoadingPlaceholder.svelte';
    import DriveItemActionsMenu from '$lib/components/DriveItemActionsMenu.svelte';
    import type { FolderResponse, FileResponse } from '$lib/api/contracts';
	import TextInputModal from '$lib/components/TextInputModal.svelte';

    let current_folder_id = $state<string | undefined>(undefined);

    let driveContent = $state<FolderContentResponse | null>(null);
    let error = $state<string | null>(null);
    
    async function fetchData(id?: string) {
        try {
            driveContent = null;
            if (id) {
                driveContent = await listContentFolder(parseInt(id));
            } else {
                driveContent = await listContentRoot();
            }
        } catch (err) { 
            error = err instanceof Error ? err.message : 'Failed to load drive contents';
        }
    }

    // for DriveItemActionsMenu
    let menuOpen = $state(false);
    let menuTarget = $state(null);
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
                try {
                     if (isFile) {
                        await deleteFile(item.id);
                    } else {
                        await deleteFolder(item.id);
                    }
                } catch (err) {
                    error = err instanceof Error ? err.message : 'Failed to delete item';
                }
                break;
        }

        await fetchData(current_folder_id);
    }

    // Actions
    let isNewFolderModalOpen = $state(false);
    async function handleCreateFolder(newFolderName: string) {
        try {
            let parentId = current_folder_id ? parseInt(current_folder_id) : null;
            if (parentId === 0) parentId = null;

            await createFolder({ 
                name: newFolderName, 
                parent_folder_id: parentId 
            });

            isNewFolderModalOpen = false;

            await fetchData(current_folder_id);
            
        } catch (err) {
            error = err instanceof Error ? err.message : 'Could not create folder';
        }
    }

    async function handleRename(newName: string) {
        try {
            if (!renameTargetId) return;

            if (renameItemType === 'file') {
                if (fileExtensionTargetFile && !newName.endsWith(`.${fileExtensionTargetFile}`)) {
                    newName += `.${fileExtensionTargetFile}`;
                }

                await renameFile(renameTargetId, newName);
            } else {
                await renameFolder(renameTargetId, newName);
            }

            isRenameModalOpen = false;
            await fetchData(current_folder_id);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Could not rename item';
        }
    }

    $effect(() => {
        current_folder_id = page.params.folderId;
        fetchData(current_folder_id);
    });
</script>

<div class="h-screen flex flex-col bg-surface-50-950 overflow-hidden font-sans text-surface-900-50">
    
    <header class="w-full px-6 h-16 flex items-center gap-4 shrink-0 z-10 border-b border-surface-500/10">
        <nav aria-label="Breadcrumb" class="flex-1">
            <ol class="flex items-center gap-2 text-sm">
                {#if !driveContent && !error}
                    <!-- Loading placeholder for breadcrumbs -->
                    <li class="flex items-center gap-2 animate-pulse">
                        <div class="placeholder w-20 h-4 rounded-full"></div>
                        <ChevronRight class="size-4 opacity-20" />
                        <div class="placeholder w-32 h-4 rounded-full opacity-60"></div>
                    </li>
                {:else if driveContent}
                    <DriveBreadcrumbs path={driveContent.path} />
                {/if}
            </ol>
        </nav>

        <Menu >
            <Menu.Trigger disabled={!driveContent} class="btn btn-sm preset-filled-primary-500 hover:preset-filled-primary-600 circle ml-auto disabled:opacity-50 disabled:cursor-not-allowed"><Plus class="size-6" /></Menu.Trigger>
            <Portal>
                <Menu.Positioner style="z-index: 9999;">
                    <Menu.Content>
                        <Menu.Item value="new_folder" onclick={() => isNewFolderModalOpen = true}>
                            <Menu.ItemText>New Folder</Menu.ItemText>
                        </Menu.Item>
                        <Menu.Item value="upload_file">
                            <Menu.ItemText>Upload File</Menu.ItemText>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu>
    </header>

    <main class="flex-1 overflow-y-auto px-4">
        {#if error}
            <div class="p-10 text-center text-error-500 font-semibold">{error}</div>
        {:else if !driveContent}
            <DriveLoadingPlaceholder />
        {:else}
            <div class="table-wrap py-3" in:fade={{ duration: 200 }}>
                <table class="table table-fixed w-full border-collapse">
                    <DriveTableHead />
                    <tbody class="[&>tr]:hover:preset-tonal-primary transition-colors cursor-pointer border-separate">
                        {#each driveContent.folders as folder}
                            <FolderRow {folder} onRightClick={handleMenuOpen} />
                        {/each}

                        {#each driveContent.files as file}
                                 <FileRow {file} onRightClick={handleMenuOpen} />            
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </main>

    <footer class="w-full py-3 px-6 bg-surface-100-800 border-t border-surface-500/10 shrink-0">
        <div class="flex items-center justify-center gap-6 text-xs font-medium opacity-60 text-center">
              <span>Total storage used: <strong class="text-surface-900-50">3.2 GB</strong></span>
              <span class="h-3 w-[1px] bg-surface-500/30"></span>
              <span>Folder size: <strong class="text-surface-900-50">51.5 MB</strong></span>
        </div>
    </footer>

    <TextInputModal title="New Folder" placeholder="Folder Name" bind:open={isNewFolderModalOpen} onSubmit={handleCreateFolder} />
    <TextInputModal title="Rename Folder" placeholder="Folder Name" bind:open={isRenameModalOpen} onSubmit={handleRename} />

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