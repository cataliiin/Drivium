<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import {
        ChevronRight,
        FileArchive,
        FileCode,
        FileIcon,
        FileImage,
        FileText,
        FileVideo,
        Folder,
        MoreVertical
    } from '@lucide/svelte';
    import { driveService } from '$lib/services/driveService.svelte';
    import FolderRow from '$lib/components/FolderRow.svelte';
    import FileRow from '$lib/components/FileRow.svelte';
    import DriveTableHead from '$lib/components/DriveTableHead.svelte';
    import DriveBreadcrumbs from '$lib/components/DriveBreadcrumbs.svelte';
    import DriveItemActionsMenu from '$lib/components/DriveItemActionsMenu.svelte';
    import DriveLoadingPlaceholder from '$lib/components/DriveLoadingPlaceholder.svelte';
    import type { FolderResponse, FileResponse } from '$lib/api/contracts';
    import TextInputModal from '$lib/components/TextInputModal.svelte';

    let { data } = $props();

    let driveContentPromise = $derived(data.streamed.driveContent);

    const fileIconMap: Record<string, { icon: any; color: string }> = {
        txt: { icon: FileText, color: 'text-blue-400' },
        pdf: { icon: FileText, color: 'text-red-400' },
        jpg: { icon: FileImage, color: 'text-amber-400' },
        jpeg: { icon: FileImage, color: 'text-amber-400' },
        png: { icon: FileImage, color: 'text-amber-400' },
        mp4: { icon: FileVideo, color: 'text-purple-400' },
        zip: { icon: FileArchive, color: 'text-orange-400' },
        js: { icon: FileCode, color: 'text-yellow-400' },
        ts: { icon: FileCode, color: 'text-blue-500' }
    };

    function formatDate(value?: string | null) {
        if (!value) return '—';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return '—';
        return parsed.toLocaleDateString('en-GB').replace(/\//g, '.');
    }

    function formatSize(bytes: number) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    function getFileIconConfig(name: string) {
        const ext = name.split('.').pop()?.toLowerCase();
        return fileIconMap[ext || ''] || { icon: FileIcon, color: 'text-surface-400' };
    }

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

    function handleMenuOpenFromElement(element: HTMLElement, item: any, type: string) {
        const rect = element.getBoundingClientRect();
        menuPos = { x: rect.right - 8, y: rect.bottom + 6 };
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
    
    <header class="w-full px-4 sm:px-8 h-16 sm:h-20 flex items-center shrink-0 border-b border-white/5 bg-surface-950/20 backdrop-blur-sm">
        <nav aria-label="Breadcrumb" class="w-full overflow-x-auto">
            <ol class="flex items-center gap-3 whitespace-nowrap">
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
            <div class="px-4 py-4 space-y-3 md:hidden">
                {#each Array(6) as _}
                    <div class="rounded-2xl border border-white/5 bg-surface-900/30 p-3">
                        <div class="flex items-center gap-3">
                            <div class="placeholder size-10 rounded-xl"></div>
                            <div class="flex-1 space-y-2">
                                <div class="placeholder h-4 w-2/3 rounded-full"></div>
                                <div class="placeholder h-3 w-1/3 rounded-full opacity-40"></div>
                            </div>
                            <div class="placeholder size-7 rounded-full opacity-20"></div>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="hidden md:block">
                <DriveLoadingPlaceholder />
            </div>
        {:then resolvedContent}
            {#if resolvedContent && (resolvedContent.folders.length > 0 || resolvedContent.files.length > 0)}
                <div class="px-4 py-4 space-y-3 md:hidden" in:fade={{ duration: 100 }}>
                    {#each resolvedContent.folders as folder}
                        <div class="group flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-900/30 p-3 shadow-sm shadow-black/20 transition-colors hover:bg-white/[0.04]">
                            <a href={folder.id ? `/drive/${folder.id}` : '/drive'} class="flex items-center gap-3 min-w-0 flex-1">
                                <div class="size-10 rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20 flex items-center justify-center">
                                    <Folder size={20} class="text-primary-400" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-sm font-semibold text-slate-100 truncate">{folder.name}</div>
                                    <div class="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                        Folder • {formatDate(folder.created_at)}
                                    </div>
                                </div>
                            </a>
                            <button
                                type="button"
                                class="size-8 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center"
                                aria-label="Open folder actions"
                                onclick={(event) => {
                                    event.preventDefault();
                                    handleMenuOpenFromElement(event.currentTarget as HTMLElement, folder, 'folder');
                                }}
                            >
                                <MoreVertical size={16} class="text-slate-300" />
                            </button>
                        </div>
                    {/each}

                    {#each resolvedContent.files as file}
                        {@const config = getFileIconConfig(file.name)}
                        {@const IconComponent = config.icon}
                        <div class="group flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-900/30 p-3 shadow-sm shadow-black/20 transition-colors hover:bg-white/[0.04]">
                            <div class="flex items-center gap-3 min-w-0 flex-1">
                                <div class="size-10 rounded-xl bg-surface-900/60 ring-1 ring-white/5 flex items-center justify-center">
                                    <IconComponent size={18} class="{config.color} opacity-90" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-sm font-medium text-slate-100 truncate">{file.name}</div>
                                    <div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                        <span>{formatSize(file.size)}</span>
                                        <span class="opacity-40">•</span>
                                        <span>{formatDate(file.uploaded_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="size-8 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center"
                                aria-label="Open file actions"
                                onclick={(event) => {
                                    event.preventDefault();
                                    handleMenuOpenFromElement(event.currentTarget as HTMLElement, file, 'file');
                                }}
                            >
                                <MoreVertical size={16} class="text-slate-300" />
                            </button>
                        </div>
                    {/each}
                </div>
                <div class="hidden md:block" in:fade={{ duration: 100 }}>
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
