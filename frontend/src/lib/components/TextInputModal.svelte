<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import { X as XIcon } from '@lucide/svelte';

    let { title, placeholder, open = $bindable(), onSubmit } = $props();
    
    let text = $state('');;

    function handleSubmit() {
        if (!text.trim()) return;
        onSubmit(text);
        text = '';
        open = false;
    }

    // for autofocus cuz idk why 'autofocus' attribute doesnt work
    let inputRef = $state<HTMLInputElement>();
    $effect(() => {
        if (open) {
            setTimeout(() => inputRef?.focus(), 100);
        }
    });
</script>

<Dialog open={open} onOpenChange={(e) => (open = e.open)}>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-[200] bg-surface-950/60 backdrop-blur-sm" />
        <Dialog.Positioner class="fixed inset-0 z-[201] flex justify-center items-center p-4">
            <Dialog.Content class="card bg-surface-100-900 w-full max-w-md p-6 space-y-4 shadow-2xl border border-surface-500/20">
                <header class="flex justify-between items-center text-surface-900-50">
                    <Dialog.Title class="text-xl font-bold">{title}</Dialog.Title>
                    <Dialog.CloseTrigger class="btn-icon hover:preset-tonal"><XIcon class="size-5" /></Dialog.CloseTrigger>
                </header>

                <input 
                    id="modal-input"
                    type="text" 
                    bind:this={inputRef}
                    bind:value={text} 
                    placeholder={placeholder} 
                    class="input p-3 bg-surface-200-800 border-none rounded-lg w-full outline-none ring-primary-500 focus:ring-2"
                    onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                <footer class="flex justify-end gap-3">
                    <Dialog.CloseTrigger class="btn hover:preset-tonal">Cancel</Dialog.CloseTrigger>
                    <button class="btn preset-filled-primary-500 font-bold" onclick={handleSubmit} disabled={!text.trim()}>
                        Submit
                    </button>
                </footer>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>