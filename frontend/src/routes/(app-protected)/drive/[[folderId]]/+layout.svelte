<script>
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { children } = $props();
</script>

<Sidebar>
    {@render children()}
</Sidebar>


