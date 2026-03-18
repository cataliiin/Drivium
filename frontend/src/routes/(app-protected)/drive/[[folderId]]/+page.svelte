<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { 
        FileImage, FileVideo, FileText, MoreVertical, 
        Plus, File, Folder, ChevronRight 
    } from '@lucide/svelte';
    import type { FolderContentResponse } from '$lib/api/contracts';
    import { listContentRoot, listContentFolder } from '$lib/api/drive';

    let driveContent = $state<FolderContentResponse | null>(null);
    let error = $state<string | null>(null);
    
    $effect(() => {
        const id = page.params.folderId;
        fetchData(id);
    });

    function navigateToFolder(id: number) {
        goto(`/drive/${id}`);
    }

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
</script>

<div class="h-screen flex flex-col bg-surface-50-950 overflow-hidden font-sans text-surface-900-50">
    
    <header class="w-full px-6 h-16 flex items-center gap-4 shrink-0 z-10 border-b border-surface-500/10">
        <nav aria-label="Breadcrumb" class="flex-1">
            <ol class="flex items-center gap-2 text-sm">
                {#if !driveContent && !error}
                    <li class="flex items-center gap-2 animate-pulse">
                        <div class="placeholder w-20 h-4 rounded-full"></div>
                        <ChevronRight class="size-4 opacity-20" />
                        <div class="placeholder w-32 h-4 rounded-full opacity-60"></div>
                    </li>
                {:else if driveContent}
                    {#each driveContent.path as crumb, i}
                        {@const isLast = i === driveContent.path.length - 1}
                        {@const isRoot = crumb.name === 'Root'}
                        {@const label = isRoot ? 'My Drive' : crumb.name}

                        <li class="flex items-center gap-2">
                            {#if isLast}
                                <span class="font-bold">{label}</span>
                            {:else}
                                <a class="opacity-60 hover:opacity-100 hover:underline transition-opacity" 
                                   href={isRoot ? '/drive' : `/drive/${crumb.id}`}>
                                    {label}
                                </a>
                                <ChevronRight class="size-4 opacity-40" aria-hidden="true" />
                            {/if}
                        </li>
                    {/each}
                {/if}
            </ol>
        </nav>

        <button 
            disabled={!driveContent}
            class="btn btn-sm preset-filled-primary-500 hover:preset-filled-primary-600 circle ml-auto disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus class="size-6" />
        </button>
    </header>

    <main class="flex-1 overflow-y-auto px-4">
        {#if error}
            <div class="p-10 text-center text-error-500 font-semibold">{error}</div>
        {:else if !driveContent}
            <div class="table-wrap py-3">
                <table class="table table-fixed w-full">
                    <thead>
                        <tr>
                            <th style="width: 60px;">Type</th>
                            <th>Name</th>
                            <th style="width: 150px;">Created</th>
                            <th style="width: 120px;" class="text-right">Size</th>
                            <th style="width: 60px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {#each Array(8) as _, i}
                        <tr class="pointer-events-none">
                            <td class="text-center">
                                <div class="placeholder size-6 rounded animate-pulse inline-block" style="animation-delay: {i * 100}ms"></div>
                            </td>
                            <td>
                                <div class="placeholder h-4 w-3/4 rounded-full animate-pulse" style="animation-delay: {i * 100}ms"></div>
                            </td>
                            <td>
                                <div class="placeholder h-4 w-24 rounded-full opacity-40 animate-pulse" style="animation-delay: {i * 100}ms"></div>
                            </td>
                            <td class="text-right">
                                <div class="placeholder h-4 w-16 rounded-full opacity-20 animate-pulse inline-block" style="animation-delay: {i * 100}ms"></div>
                            </td>
                            <td class="text-right">
                                <div class="placeholder size-8 rounded-full opacity-10 animate-pulse inline-block" style="animation-delay: {i * 100}ms"></div>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <div class="table-wrap py-3" in:fade={{ duration: 200 }}>
                <table class="table table-fixed w-full border-collapse">
                    <thead class="sticky top-0 bg-surface-50-950 shadow-sm z-10">
                        <tr>
                            <th style="width: 60px;" class="text-center opacity-50 font-normal">Type</th>
                            <th class="text-left opacity-50 font-normal">Name</th>
                            <th style="width: 150px;" class="text-left opacity-50 font-normal">Uploaded</th>
                            <th style="width: 120px;" class="text-right opacity-50 font-normal">Size</th>
                            <th style="width: 60px;"></th>
                        </tr>
                    </thead>
                    <tbody class="[&>tr]:hover:preset-tonal-primary transition-colors cursor-pointer border-separate">
                        {#each driveContent.folders as folder}
                            <tr onclick={() => navigateToFolder(folder.id)}>
                                <td class="text-center">
                                    <Folder class="size-6 text-primary-500 fill-primary-500/20 mx-auto" />
                                </td>
                                <td class="truncate font-medium text-left">{folder.name}</td>
                                <td class="text-left font-mono text-sm opacity-70 tabular-nums">
                                    {new Date(folder.created_at).toLocaleDateString('en-GB').replace(/\//g, '.')}
                                </td>
                                <td class="text-left opacity-30 text-xs italic">—</td>
                                <td class="text-right">
                                    <button class="btn btn-sm btn-ghost circle"><MoreVertical class="size-5" /></button>
                                </td>
                            </tr>
                        {/each}

                        {#each driveContent.files as file}
                            {@const ext = file.name.split('.').pop()?.toLowerCase()}
                            {@const IconComponent = ext === 'txt' ? FileText : (['jpg', 'png', 'jpeg'].includes(ext ?? '')) ? FileImage : ext === 'mp4' ? FileVideo : File}
                            <tr>
                                <td class="text-center">
                                    <IconComponent class="size-6 text-surface-400 mx-auto" />
                                </td>
                                <td class="truncate text-left">{file.name}</td>
                                <td class="text-left font-mono text-sm opacity-70 tabular-nums">
                                    {new Date(file.uploaded_at || "").toLocaleDateString('en-GB').replace(/\//g, '.')}
                                </td>
                                <td class="text-left font-mono text-sm opacity-70 tabular-nums">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </td>
                                <td class="text-right">
                                    <button class="btn btn-sm btn-ghost circle"><MoreVertical class="size-5" /></button>
                                </td>
                            </tr>                        
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

</div>

<style>
    .table-wrap {
        width: 100%;
    }
    table {
        table-layout: fixed;
    }
</style>