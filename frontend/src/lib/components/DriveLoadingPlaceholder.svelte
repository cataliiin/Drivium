<script lang="ts">
    import DriveTableHead from './DriveTableHead.svelte';
</script>

<div class="table-wrap py-3">
    <table class="table table-fixed w-full">
        <DriveTableHead />
        <tbody>
            {#each Array(8) as _, i}
                <tr class="pointer-events-none animate-pulse">
                    <td class="text-center"><div class="placeholder size-6 rounded inline-block"></div></td>
                    <td><div class="placeholder h-4 w-3/4 rounded-full"></div></td>
                    <td><div class="placeholder h-4 w-24 rounded-full opacity-40"></div></td>
                    <td class="text-right"><div class="placeholder h-4 w-16 rounded-full opacity-20"></div></td>
                    <td class="text-right"><div class="placeholder size-8 rounded-full opacity-10"></div></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>