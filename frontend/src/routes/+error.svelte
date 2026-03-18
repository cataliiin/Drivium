<script>
    import './layout.css';
    import { page } from '$app/stores';
</script>

<div class="flex justify-center min-h-screen items-center">
    {#if $page.status === 404}
        <p class="text-4xl font-bold">404</p>
        <p class="text-4xl">-page-not-found</p>
    {:else if $page.status === 503}
        <p class="text-4xl font-bold">503</p>
        <p class="text-4xl">-service-unavailable</p>
    {/if}
</div>