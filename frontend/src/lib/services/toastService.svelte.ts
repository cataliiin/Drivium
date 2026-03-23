import { createToaster } from '@skeletonlabs/skeleton-svelte';

export const toastService = createToaster({
    placement: 'bottom-end',
    overlap: true,
    duration: 2000,
});
