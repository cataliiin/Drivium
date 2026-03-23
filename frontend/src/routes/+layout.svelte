<script lang="ts">
    import { onNavigate } from '$app/navigation';
    import { toastService } from '$lib/services/toastService.svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });

    const { children } = $props();
</script>

{@render children()}

<Toast.Group toaster={toastService}>
    {#snippet children(toast)}
        <Toast {toast} class="gap-3 p-3 bg-surface-900 ">
            <Toast.Message>
            <Toast.Title class="text-sm font-bold uppercase tracking-widest leading-none">{toast.title}</Toast.Title>
            <Toast.Description class="text-sm font-light opacity-80 text-surface-content">{toast.description}</Toast.Description>
            </Toast.Message>
            {#if toast.closable}
				<Toast.CloseTrigger />
			{/if}
        </Toast>
    {/snippet}
</Toast.Group>

<style>
    ::view-transition-group(root) {
        animation-duration: 500ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::view-transition-old(root) {
        animation: zoom-out-exit 200ms cubic-bezier(0.4, 0, 1, 1) both;
        z-index: 1;
    }

    ::view-transition-new(root) {
        animation: zoom-out-entrance 200ms cubic-bezier(0, 0, 0.2, 1) both;
        z-index: 2;
    }

    @keyframes zoom-out-exit {
        from { 
            opacity: 1;
            transform: scale(1);
            filter: blur(0px) brightness(1);
        }
        to { 
            opacity: 0;
            transform: scale(0.99);
            filter: blur(4px) brightness(0.5);
        }
    }

    @keyframes zoom-out-entrance {
        from { 
            opacity: 0;
            transform: scale(1.01);
            filter: brightness(1.1);
        }
        to { 
            opacity: 1;
            transform: scale(1);
            filter: brightness(1);
        }
    }

    ::view-transition-image-pair(root) {
        isolation: isolate;
    }
</style>