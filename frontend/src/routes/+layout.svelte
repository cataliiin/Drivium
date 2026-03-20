<script lang="ts">
    import { onNavigate } from '$app/navigation';

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

<style>
    ::view-transition-group(root) {
        animation-duration: 500ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::view-transition-old(root) {
        animation: zoom-out-exit 200ms cubic-bezier(0.4, 0, 1, 1) both;
        z-index: 1;
    }

    /* Pagina care intră (Fade In discret) */
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
            transform: scale(0.99); /* Se micșorează */
            filter: blur(4px) brightness(0.5);
        }
    }

    @keyframes zoom-out-entrance {
        from { 
            opacity: 0;
            transform: scale(1.01); /* Vine de la "aproape" spre normal */
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