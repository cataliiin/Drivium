<script lang="ts">
    import { Folder } from '@lucide/svelte';
    import { goto } from '$app/navigation';

    let { folder, onRightClick } = $props();
    const date = $derived(new Date(folder.created_at).toLocaleDateString('en-GB').replace(/\//g, '.'));

    function navigateToFolder(id: number) {
        goto(`/drive/${id}`);
    }

    function handleRightClick(event: MouseEvent) {
        event.preventDefault();
        onRightClick(event, folder, 'folder');
    }
</script>

<tr onclick={() => navigateToFolder(folder.id)}
    oncontextmenu={handleRightClick}
    class="group cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors border-b border-white/[0.03]"
>
    <td class="w-12 py-3 pl-5 leading-none">
        <Folder size={20} class="text-primary-500 fill-primary-500/10 shrink-0 transition-transform group-hover:scale-110" />
    </td>
    
    <td class="py-3 pl-3 pr-4 text-left">
        <span class="text-sm font-semibold font-mono text-slate-200 group-hover:text-white truncate block tracking-tight">
            {folder.name}
        </span>
    </td>
    
    <td class="py-3 px-4 text-xs font-mono text-slate-500 group-hover:text-slate-300 hidden md:table-cell transition-colors">
        {date}
    </td>
    
    <td class="py-3 pr-10 text-xs text-slate-600 text-right italic tabular-nums">
        —
    </td>
</tr>