<script lang="ts">
    import {
        HouseIcon,
        HardDriveIcon,
        Trash2,
        Users,
        LogOut,
        FileIcon,
        UploadCloudIcon,
        Loader2Icon,
        CheckCircle2Icon,
        AlertCircleIcon,
        FolderPlusIcon
    } from '@lucide/svelte';
    import { Navigation, Progress } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import { driveService } from '$lib/services/driveService.svelte';
    import TextInputModal from '$lib/components/TextInputModal.svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    const linksSidebar = {
        Drives: [
            { label: 'My drive', href: '/drive', icon: HardDriveIcon }
        ]
    };

    let { children } = $props();

    let fileInput: HTMLInputElement;
    let currentFolderId = $derived(page.params.folderId ? parseInt(page.params.folderId) : null);

    let showUploadZone = $state(false);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

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

    let isNewFolderModalOpen = $state(false);
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

<div class="bg-charcoal-blue-950 grid h-screen w-screen grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
    <Navigation layout="sidebar" class="grid h-full grid-rows-[auto_1fr_auto] gap-4">
        <Navigation.Header class="flex py-4 pl-2">
            <a href="/" class="flex" aria-label="Home" title="Drivium Home">
                <p class="text-4xl font-bold">Drivium</p>
            </a>
        </Navigation.Header>

        <Navigation.Content>
            <Navigation.Group>
                <Navigation.Menu>
                    <Navigation.TriggerAnchor href="/" aria-label="Home">
                        <HouseIcon class="size-4" aria-hidden="true" />
                        <Navigation.TriggerText>Home</Navigation.TriggerText>
                    </Navigation.TriggerAnchor>
                </Navigation.Menu>
            </Navigation.Group>

            {#each Object.entries(linksSidebar) as [category, links]}
                <Navigation.Group>
                    <Navigation.Label class="pl-2 capitalize">{category}</Navigation.Label>
                    <Navigation.Menu>
                        {#each links as link (link)}
                            {@const Icon = link.icon}
                            <Navigation.TriggerAnchor href={link.href} title={link.label} aria-label={link.label}>
                                <Icon class="size-4" aria-hidden="true" />
                                <Navigation.TriggerText>{link.label}</Navigation.TriggerText>
                            </Navigation.TriggerAnchor>
                        {/each}
                    </Navigation.Menu>
                </Navigation.Group>
            {/each}

            <Navigation.Group class="mt-auto mb-4 border-t border-surface-500/10 px-4 pt-6">
                <div class="flex flex-col gap-5 max-w-[240px]">
                    <div class="flex flex-col gap-2">
                        <button 
                            type="button" 
                            onclick={() => isNewFolderModalOpen = true}
                            class="btn preset-tonal-surface hover:preset-filled-surface-600 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold transition-all active:scale-95" 
                        >
                            <FolderPlusIcon class="size-4" />
                            <span>New Folder</span>
                        </button>

                        <button 
                            type="button" 
                            onclick={triggerFileInput}
                            class="btn preset-filled-primary-500 hover:preset-filled-primary-600 flex w-full items-center justify-center gap-2 py-2.5 text-sm font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95" 
                        >
                            <UploadCloudIcon class="size-4" />
                            <span>Upload Files</span>
                        </button>
                    </div>

                    {#if showUploadZone}
                        <div 
                            transition:slide={{ duration: 400, easing: quintOut }}
                            class="flex gap-4 overflow-hidden"
                        >
                            <div class="flex">
                                <Progress 
                                    value={driveService.currentUpload?.progress ?? 0} 
                                    max={100} 
                                    orientation="vertical" 
                                >
                                    <Progress.Track class="bg-surface-500/10 h-40 w-2">
                                        <Progress.Range class="bg-primary-500 transition-all duration-500" />
                                    </Progress.Track>
                                </Progress>
                            </div>

                            <div class="flex flex-1 flex-col gap-3 overflow-hidden min-w-0">
                                {#if driveService.currentUpload}
                                    <div 
                                        in:fade={{ duration: 200 }}
                                        class="flex flex-col gap-1.5 rounded-xl border border-primary-500/20 bg-primary-500/10 p-2.5 w-full overflow-hidden"
                                    >
                                        <div class="flex items-center gap-2 text-xs font-bold overflow-hidden">
                                            <Loader2Icon class="size-3.5 shrink-0 animate-spin {driveService.currentUpload.status === 'confirming' ? 'text-secondary-500' : 'text-primary-500'}" />
                                            <span class="truncate block" title={driveService.currentUpload.file.name}>
                                                {driveService.currentUpload.file.name}
                                            </span>
                                        </div>

                                        <div class="flex flex-col pl-5 text-[10px] overflow-hidden">
                                            <span class="font-bold tracking-tight text-primary-500 uppercase">
                                                {driveService.currentUpload.status === 'confirming' ? 'Finalizing...' : 'Uploading...'}
                                            </span>
                                            <span class="font-mono text-[11px] tabular-nums opacity-50 truncate">
                                                {driveService.currentUpload.speed} • {driveService.currentUpload.eta}
                                            </span>
                                        </div>
                                    </div>
                                {/if}

                                <div class="flex flex-col gap-1.5 overflow-hidden">
                                    <p class="text-[9px] font-bold uppercase opacity-30 tracking-widest">
                                        Next ({driveService.uploadQueue.filter(u => u.status === 'waiting').length})
                                    </p>
                                    
                                    <div class="scrollbar-thin flex h-28 flex-col gap-2 overflow-y-auto pr-1">
                                        {#each driveService.uploadQueue as item (item.id)}
                                            {#if item.status === 'waiting'}
                                                <div 
                                                    in:fade
                                                    class="flex shrink-0 items-center gap-2 px-1 opacity-50 overflow-hidden"
                                                >
                                                    <FileIcon class="size-3 shrink-0" />
                                                    <span class="truncate text-[10px] block" title={item.file.name}>
                                                        {item.file.name}
                                                    </span>
                                                </div>
                                            {/if}
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </Navigation.Group>
        </Navigation.Content>

        <Navigation.Footer>
            <div class="relative">
                <Navigation.TriggerAnchor
                    href="#"
                    title="Log Out"
                    aria-label="Log Out"
                    class="pointer-events-none"
                >
                    <LogOut class="size-4" aria-hidden="true" />
                    <Navigation.TriggerText>Log Out</Navigation.TriggerText>
                </Navigation.TriggerAnchor>

                <form
                    method="POST"
                    action="/logout?/logout"
                    use:enhance
                    class="absolute inset-0 z-10 h-full w-full"
                >
                    <button
                        type="submit"
                        class="absolute inset-0 h-full w-full cursor-pointer border-none bg-transparent opacity-0"
                        aria-label="Log Out"
                    ></button>
                </form>
            </div>
        </Navigation.Footer>
    </Navigation>

    <TextInputModal 
        title="New Folder" 
        placeholder="Folder Name" 
        bind:open={isNewFolderModalOpen} 
        onSubmit={handleCreateFolder} 
    />

    <div class="h-full overflow-hidden p-0">
        {@render children()}
    </div>
</div>

<style>
    .scrollbar-thin::-webkit-scrollbar {
        width: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
</style>