

<script lang="ts">
    import { FileImage, FileVideo, FileText, MoreVertical, Plus, Icon, File} from '@lucide/svelte';

    const tableData = [
        { id: '1', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '2', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '3', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '4', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '5', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '6', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '7', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '8', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '9', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '10', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '11', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '12', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '13', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '14', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '15', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '16', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '17', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '18', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '19', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },
        { id: '20', name: 'beach_sunset.jpg', type: 'Image', size: '2.4 MB', date: '2024-06-12' },

    ];

    const getIcon = (type: string) => {
        if (type === 'Image') return FileImage;
        if (type === 'Video') return FileVideo;
        return FileText;
    };
</script>

<div class="h-screen flex flex-col bg-surface-50-950 overflow-hidden">
    
    <header class="w-full p-5 h-16 flex items-center gap-4 shrink-0 z-10">
        <ol class="flex items-center gap-4 text-sm">
            <li><a class="opacity-60 hover:underline" href="/">Root</a></li>
            <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
            <li><a class="opacity-60 hover:underline" href="/categories">Photos</a></li>
            <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
            <li class="font-bold">Summer</li>
        </ol>
        <button class="btn btn-sm preset-filled-primary-500 hover:preset-filled-primary-600 circle ml-auto">
            <Plus class="size-7" />
        </button>
    </header>

    <hr class="hr border-surface-500/10" />

    <main class="flex-1 overflow-y-auto">
        <div class="table-wrap p-3">
            <table class="table caption-bottom relative">
                <thead class="sticky top-0 bg-surface-50-950 shadow-sm z-10">
                    <tr>
                        <th class="w-10">Type</th>
                        <th>Name</th>
                        <th>Date Modified</th>
                        <th class="text-right!">Size</th>
                        <th class="w-10"></th>
                    </tr>
                </thead>
                <tbody class="[&>tr]:hover:preset-tonal-primary transition-colors cursor-pointer">
                    {#each tableData as file (file.id)}
                        <tr>
                            <td>
                                <File class="size-5 text-surface-500" />
                            </td>
                            <td class="font-medium">{file.name}</td>
                            <td class="opacity-60">{file.date}</td>
                            <td class="text-right font-mono text-xs">{file.size}</td>
                            <td>
                                <button class="btn btn-sm hover:preset-soft-surface p-1">
                                    <MoreVertical class="size-4" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>

            </table>
        </div>
    </main>

    <footer class="sticky bottom-0 z-50 w-full p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
        <div class="container mx-auto text-sm text-center opacity-50">
              Total storage used: 3.2 GB 
              <vr class="mx-7 inline-block h-3 border-l border-white/20" ></vr>
              Storage used in this folder: 51.5 MB 
        </div>
    </footer>

</div>