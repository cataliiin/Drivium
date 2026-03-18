<script lang="ts">
    import { Folder, MoreVertical } from '@lucide/svelte';
    import { goto } from '$app/navigation';

    let { folder } = $props();
    const date = $derived(new Date(folder.created_at).toLocaleDateString('en-GB').replace(/\//g, '.'));

    function navigateToFolder(id: number) {
        goto(`/drive/${id}`);
    }

</script>

<tr onclick={() => navigateToFolder(folder.id)}>
    <td class="text-center">
        <Folder class="size-6 text-primary-500 fill-primary-500/20 mx-auto" />
    </td>
    <td class="truncate font-medium text-left">{folder.name}</td>
    <td class="text-left font-mono text-sm opacity-70 tabular-nums">
        {date}
    </td>
    <td class="text-left opacity-30 text-xs italic">—</td>
    <td class="text-right">
        <button class="btn btn-sm btn-ghost circle"><MoreVertical class="size-5" /></button>
    </td>
</tr>