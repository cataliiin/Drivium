<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    import MobileDriveShell from "$lib/components/Mobile/DriveShell.svelte";

    let { children } = $props();
</script>

<div class="hidden md:block">
    <Sidebar>
        {@render children()}
    </Sidebar>
</div>

<div class="md:hidden">
    <MobileDriveShell>
        {@render children()}
    </MobileDriveShell>
</div>


