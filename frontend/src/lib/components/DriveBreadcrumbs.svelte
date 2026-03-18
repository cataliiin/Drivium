<script lang="ts">
    import { ChevronRight } from '@lucide/svelte';
    let { path } = $props();
</script>

<nav aria-label="Breadcrumb" class="flex-1">
    <ol class="flex items-center gap-2 text-sm">
        {#each path as crumb, i}
            {@const isLast = i === path.length - 1}
            {@const isRoot = crumb.name === 'Root'}
            {@const label = isRoot ? 'My Drive' : crumb.name}

            <li class="flex items-center gap-2">
                {#if isLast}
                    <span class="font-bold">{label}</span>
                {:else}
                    <a class="opacity-60 hover:opacity-100 transition-opacity" 
                       href={isRoot ? '/drive' : `/drive/${crumb.id}`}>
                        {label}
                    </a>
                    <ChevronRight class="size-4 opacity-40" />
                {/if}
            </li>
        {/each}
    </ol>
</nav>