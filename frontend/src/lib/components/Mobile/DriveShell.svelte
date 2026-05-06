<script lang="ts">
    import {
        HouseIcon,
        HardDriveIcon,
        UploadCloudIcon,
        FolderPlusIcon,
        User2Icon,
        LogOut,
        FileIcon,
        Loader2Icon
    } from '@lucide/svelte';
    import { Progress } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import { driveService } from '$lib/services/driveService.svelte';
    import TextInputModal from '$lib/components/TextInputModal.svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Logo from '$lib/components/Logo.svelte';

    let { children } = $props();

    let fileInput: HTMLInputElement;
    let currentFolderId = $derived(page.params.folderId ? parseInt(page.params.folderId) : null);

    let showUploadZone = $state(false);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    let isNewFolderModalOpen = $state(false);

    const isDriveActive = $derived(page.url.pathname.startsWith('/drive'));
    const isHomeActive = $derived(page.url.pathname === '/');

    $effect(() => {
        if (driveService.uploadQueue.length > 0) {
            if (!showUploadZone && !timeoutId) {
                timeoutId = setTimeout(() => {
                    showUploadZone = true;
                }, 1000);
            }
        } else {
            showUploadZone = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
        }
    });

    function triggerFileInput() {
        fileInput.click();
    }

    function handleFileSelection(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            driveService.registerUploadFiles(target.files, currentFolderId);
            target.value = '';
        }
    }

    async function handleCreateFolder(newFolderName: string) {
        await driveService.createFolder(newFolderName, currentFolderId);
    }
</script>

<input
    type="file"
    multiple
    bind:this={fileInput}
    onchange={handleFileSelection}
    class="hidden"
/>

<div class="min-h-screen w-full bg-surface-950 flex flex-col overflow-hidden relative">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-20%] right-[-20%] w-80 h-80 bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[10%] left-[-10%] w-72 h-72 bg-secondary-500/10 rounded-full blur-[120px]"></div>
    </div>

    <header class="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/5 bg-surface-950/70 backdrop-blur-xl">
        <Logo size={28} showDot={true} />

        <div class="flex items-center gap-2">
            <a
                href="/account"
                class="size-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center"
                aria-label="Account"
            >
                <User2Icon size={16} class="text-slate-200" />
            </a>

            <div class="relative size-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center">
                <LogOut size={16} class="text-error-500/80" />
                <form method="POST" action="/logout?/logout" use:enhance class="absolute inset-0">
                    <button type="submit" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Log out"></button>
                </form>
            </div>
        </div>
    </header>

    <main class="flex-1 overflow-hidden pb-24 relative z-10">
        {@render children()}
    </main>

    {#if showUploadZone}
        <div
            transition:slide={{ duration: 300, easing: quintOut }}
            class="fixed left-4 right-4 bottom-24 z-40 rounded-2xl bg-surface-900/95 border border-white/10 shadow-2xl p-4"
        >
            {#if driveService.currentUpload}
                <div in:fade={{ duration: 200 }} class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Loader2Icon size={14} class="animate-spin text-primary-400" />
                        <span class="text-[10px] font-bold uppercase tracking-widest opacity-60 truncate">
                            {driveService.currentUpload.status === 'confirming' ? 'Finalizing' : 'Uploading'}
                        </span>
                    </div>

                    <Progress value={driveService.currentUpload?.progress ?? 0} max={100} class="h-1.5 rounded-full overflow-hidden">
                        <Progress.Track class="bg-white/5">
                            <Progress.Range class="bg-primary-500 transition-all duration-300 rounded-full" />
                        </Progress.Track>
                    </Progress>

                    <div class="flex justify-between text-[10px] font-mono opacity-50">
                        <span>{driveService.currentUpload.progress}%</span>
                        <span class="truncate ml-2 tabular-nums">{driveService.currentUpload.speed}</span>
                    </div>
                </div>
            {/if}

            <div class="mt-3 max-h-16 overflow-y-auto space-y-2 pr-1 border-t border-white/5 pt-3">
                {#each driveService.uploadQueue as item (item.id)}
                    {#if item.status === 'waiting'}
                        <div in:fade class="flex items-center gap-2 px-1 opacity-40">
                            <FileIcon size={12} class="shrink-0" />
                            <span class="truncate text-[10px] flex-1 text-left">{item.file.name}</span>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-surface-950/90 backdrop-blur-xl">
        <div class="grid grid-cols-4 gap-1 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] text-[10px] font-bold uppercase tracking-[0.2em]">
            <a
                href="/"
                class="flex flex-col items-center gap-1 rounded-xl py-2 transition-all
                    {isHomeActive ? 'text-primary-400' : 'text-slate-500 hover:text-slate-200'}"
            >
                <HouseIcon size={18} />
                <span>Home</span>
            </a>

            <a
                href="/drive"
                class="flex flex-col items-center gap-1 rounded-xl py-2 transition-all
                    {isDriveActive ? 'text-primary-400' : 'text-slate-500 hover:text-slate-200'}"
            >
                <HardDriveIcon size={18} />
                <span>Drive</span>
            </a>

            <button
                type="button"
                onclick={() => isNewFolderModalOpen = true}
                class="flex flex-col items-center gap-1 rounded-xl py-2 transition-all text-slate-500 hover:text-slate-200"
            >
                <FolderPlusIcon size={18} />
                <span>New</span>
            </button>

            <button
                type="button"
                onclick={triggerFileInput}
                class="flex flex-col items-center gap-1 rounded-xl py-2 transition-all text-slate-500 hover:text-slate-200"
            >
                <UploadCloudIcon size={18} />
                <span>Upload</span>
            </button>
        </div>
    </nav>

    <TextInputModal
        title="New Folder"
        placeholder="Folder Name"
        bind:open={isNewFolderModalOpen}
        onSubmit={handleCreateFolder}
    />
</div>
