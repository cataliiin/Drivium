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
    // Importăm doar componentele necesare de la Skeleton
    import { Progress } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import { driveService } from '$lib/services/driveService.svelte';
    import TextInputModal from '$lib/components/TextInputModal.svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Logo from '$lib/components/Logo.svelte';


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

<div class="bg-surface-950 grid h-screen w-screen grid-cols-[auto_1fr] items-stretch overflow-hidden relative">
    
    <aside class="flex flex-col h-full w-72 border-r border-white/5 bg-surface-950/40 backdrop-blur-xl transition-all relative z-10">
        
        <div class="flex pt-10 pb-8 px-6">
            <Logo size={40} showDot={true} />
        </div>

        <div class="flex-1 flex flex-col gap-10 px-3 overflow-y-auto scrollbar-thin">
            
            <div class="flex flex-col gap-1">
                <a href="/" class="group flex items-center gap-3 rounded-xl py-3 px-4 transition-all text-surface-400 hover:bg-white/5 hover:text-white">
                    <HouseIcon size={18} class="opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span class="text-sm font-medium">Home</span>
                </a>
            </div>

            {#each Object.entries(linksSidebar) as [category, links]}
                <div class="flex flex-col gap-1">
                    <p class="pl-4 text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-3">{category}</p>
                    
                    {#each links as link (link)}
                        {@const Icon = link.icon}
                        {@const isActive = page.url.pathname === link.href}
                        
                        <a 
                            href={link.href} 
                            class="group flex items-center gap-3 rounded-xl py-3 px-4 transition-all mb-1 w-full
                            {isActive 
                                ? 'bg-primary-500/10 text-primary-500 font-bold' 
                                : 'text-surface-400 hover:bg-white/5 hover:text-white'}"
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} class={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 transition-opacity'} />
                            <span class="text-sm flex-1 text-left">{link.label}</span>
                        </a>
                    {/each}
                </div>
            {/each}
            
            <div class="mt-auto mb-6 border-t border-white/5 px-2 pt-8 w-full flex flex-col gap-3">
                
                <button 
                    type="button" 
                    onclick={() => isNewFolderModalOpen = true}
                    class="btn btn-sm hover:bg-white/5 flex w-full items-center justify-start gap-3 py-3 px-4 text-sm font-medium transition-all rounded-xl border border-white/5 opacity-80 hover:opacity-100" 
                >
                    <FolderPlusIcon size={18} class="text-secondary-400" />
                    <span>New Folder</span>
                </button>

                <button 
                    type="button" 
                    onclick={triggerFileInput}
                    class="btn btn-sm preset-filled-primary-500 hover:brightness-110 active:scale-[0.98] flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-2xl shadow-primary-500/15 transition-all rounded-xl" 
                >
                    <UploadCloudIcon size={19} />
                    <span>Upload Files</span>
                </button>

                {#if showUploadZone}
                    <div 
                        transition:slide={{ duration: 400, easing: quintOut }}
                        class="mt-3 p-4 rounded-2xl bg-surface-900 border border-white/10 shadow-inner overflow-hidden"
                    >
                        {#if driveService.currentUpload}
                            <div in:fade={{ duration: 200 }} class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <Loader2Icon size={14} class="animate-spin text-primary-500" />
                                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-60 truncate">
                                        {driveService.currentUpload.status === 'confirming' ? 'Finalizing' : 'Uploading'}
                                    </span>
                                </div>
                                
                                <Progress value={driveService.currentUpload?.progress ?? 0} max={100} class="h-1.5 rounded-full overflow-hidden">
                                    <Progress.Track class="bg-white/5">
                                        <Progress.Range class="bg-primary-500 transition-all duration-300 rounded-full" />
                                    </Progress.Track>
                                </Progress>

                                <div class="flex justify-between text-[10px] font-mono opacity-40">
                                    <span>{driveService.currentUpload.progress}%</span>
                                    <span class="truncate ml-2 tabular-nums">{driveService.currentUpload.speed}</span>
                                </div>
                            </div>
                        {/if}

                        <div class="scrollbar-thin mt-3 max-h-20 overflow-y-auto space-y-2 pr-1 border-t border-white/5 pt-3">
                            {#each driveService.uploadQueue as item (item.id)}
                                {#if item.status === 'waiting'}
                                    <div in:fade class="flex items-center gap-2 px-1 opacity-30 group">
                                        <FileIcon size={12} class="shrink-0" />
                                        <span class="truncate text-[10px] flex-1 text-left">{item.file.name}</span>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="p-4 px-5 border-t border-white/5">
            <div class="relative w-full">
                <a
                    href="#"
                    class="group flex items-center gap-3 rounded-xl py-3 px-4 transition-all w-full text-error-500/70 hover:text-error-500 hover:bg-error-500/10"
                >
                    <LogOut size={18} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span class="text-sm font-medium">Log Out</span>
                </a>

                <form method="POST" action="/logout?/logout" use:enhance class="absolute inset-0 z-10 h-full w-full">
                    <button type="submit" class="absolute inset-0 h-full w-full cursor-pointer opacity-0"></button>
                </form>
            </div>
        </div>
    </aside>

    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute top-[-15%] left-[-10%] w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[20%] left-[10%] w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px]"></div>
    </div>

    <TextInputModal 
        title="New Folder" 
        placeholder="Folder Name" 
        bind:open={isNewFolderModalOpen} 
        onSubmit={handleCreateFolder} 
    />

    <main class="h-full overflow-hidden bg-surface-900/30 border-l border-white/5 relative z-10">
        {@render children()}
    </main>
</div>

<style>

    .scrollbar-thin::-webkit-scrollbar {
        width: 2px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 10px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }
</style>