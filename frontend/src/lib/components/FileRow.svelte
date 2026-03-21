<script lang="ts">
    import { 
        FileImage, FileVideo, FileText, FileAudio, 
        FileArchive, FileCode, FileIcon
    } from '@lucide/svelte';

    let { file, onRightClick } = $props();

    const iconMap: Record<string, {icon: any, color: string}> = {
        txt: { icon: FileText, color: 'text-blue-400' },
        pdf: { icon: FileText, color: 'text-red-400' },
        jpg: { icon: FileImage, color: 'text-amber-400' },
        png: { icon: FileImage, color: 'text-amber-400' },
        mp4: { icon: FileVideo, color: 'text-purple-400' },
        zip: { icon: FileArchive, color: 'text-orange-400' },
        js: { icon: FileCode, color: 'text-yellow-400' },
        ts: { icon: FileCode, color: 'text-blue-500' }
    };
    
    const ext = $derived(file.name.split('.').pop()?.toLowerCase());
    const config = $derived(iconMap[ext] || { icon: FileIcon, color: 'text-surface-400' });
    const IconComponent = $derived(config.icon);
    const date = $derived(new Date(file.uploaded_at || "").toLocaleDateString('en-GB').replace(/\//g, '.'));

    function handleRightClick(event: MouseEvent) {
        event.preventDefault();
        onRightClick(event, file, 'file');
    }
</script>

<tr oncontextmenu={handleRightClick} 
    class="group cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors border-b border-white/[0.03]"
>
    <td class="w-12 py-3 pl-5 leading-none">
        <IconComponent size={20} class="{config.color} opacity-90 shrink-0 transition-transform group-hover:scale-110" />
    </td>
    
    <td class="py-3 pl-3 pr-4 text-left">
        <span class="text-sm font-medium font-mono text-slate-300 group-hover:text-white truncate block tracking-tight">
            {file.name}
        </span>
    </td>
    
    <td class="py-3 px-4 text-xs font-mono text-slate-500 group-hover:text-slate-300 hidden md:table-cell transition-colors">
        {date}
    </td>
    
    <td class="py-3 pr-10 text-xs font-mono text-slate-500 text-right tabular-nums group-hover:text-slate-300 transition-colors">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
    </td>
</tr>