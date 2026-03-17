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
</script>

<slot />

<style>
    ::view-transition-group(root) {
        animation-duration: 400ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::view-transition-old(root) {
        animation: fade-out-subtle 250ms ease-in both;
    }

    ::view-transition-new(root) {
        animation: premium-entrance 400ms cubic-bezier(0, 0, 0.2, 1) both;
    }

    @keyframes fade-out-subtle {
        from { 
            opacity: 1; 
            filter: saturate(1) brightness(1);
        }
        to { 
            opacity: 0; 
            filter: saturate(0.5) brightness(0.4);
            transform: scale(0.98);
        }
    }

    @keyframes premium-entrance {
        from { 
            opacity: 0; 
            transform: translateY(10px);
            filter: blur(3px) brightness(1.2) saturate(0.0);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
            filter: blur(0) brightness(1) saturate(1);
        }
    }

    ::view-transition-image-pair(root) {
        isolation: isolate;
    }
</style>