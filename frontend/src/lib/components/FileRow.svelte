<script lang="ts">
    import { 
        FileImage, FileVideo, FileText, FileAudio, 
        FileArchive, FileCode, MoreVertical, FileIcon
    } from '@lucide/svelte';

    let { file, onRightClick } = $props();

    const iconMap: Record<string, any> = {
            txt: FileText,
            pdf: FileText,
            jpg: FileImage,
            jpeg: FileImage,
            png: FileImage,
            gif: FileImage,
            mp4: FileVideo,
            mov: FileVideo,
            mp3: FileAudio,
            zip: FileArchive,
            rar: FileArchive,
            js: FileCode,
            ts: FileCode,
            json: FileCode
        };
    
    const ext = $derived(file.name.split('.').pop()?.toLowerCase());
    const IconComponent = $derived(iconMap[ext] || FileIcon);
    const date = $derived(new Date(file.uploaded_at || "").toLocaleDateString('en-GB').replace(/\//g, '.'));

    function handleRightClick(event: MouseEvent) {
        event.preventDefault();
        onRightClick(event, file, 'file');
    }
</script>

<tr oncontextmenu={handleRightClick}>
    <td class="text-center">
        <IconComponent class="size-6 text-surface-400 mx-auto" />
    </td>
    <td class="truncate text-left">{file.name}</td>
    <td class="text-left font-mono text-sm opacity-70 tabular-nums">
        {date}
    </td>
    <td class="text-left font-mono text-sm opacity-70 tabular-nums">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
    </td>
    <td class="text-right">
        <button class="btn btn-sm btn-ghost circle" onclick={handleRightClick}>
            <MoreVertical class="size-5" />
        </button>
    </td>
</tr>