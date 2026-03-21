<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import { X as XIcon } from '@lucide/svelte';

    let { title, placeholder, open = $bindable(), onSubmit } = $props();
    
    let text = $state('');

    function handleSubmit() {
        if (!text.trim()) return;
        onSubmit(text);
        text = '';
        open = false;
    }

    // Autofocus logic
    let inputRef = $state<HTMLInputElement>();
    $effect(() => {
        if (open) {
            setTimeout(() => inputRef?.focus(), 150);
        }
    });
</script>

<Dialog open={open} onOpenChange={(e) => (open = e.open)}>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md" />
        
        <Dialog.Positioner class="fixed inset-0 z-[201] flex justify-center items-center p-4">
            <Dialog.Content class="bg-surface-950/90 border border-white/10 w-full max-w-md p-8 space-y-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl backdrop-blur-2xl">
                
                <header class="flex justify-between items-center">
                    <Dialog.Title class="text-xl font-black tracking-tight text-white leading-none">
                        {title}
                    </Dialog.Title>
                    <Dialog.CloseTrigger class="text-white/40 hover:text-white transition-colors p-1">
                        <XIcon size={20} />
                    </Dialog.CloseTrigger>
                </header>

                <div class="space-y-4">
                    <input 
                        id="modal-input"
                        type="text" 
                        bind:this={inputRef}
                        bind:value={text} 
                        placeholder={placeholder} 
                        class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:opacity-30 outline-none transition-all focus:border-primary-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-primary-500/10"
                        onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                <footer class="flex justify-end gap-3 pt-2">
                    <Dialog.CloseTrigger class="px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors">
                        Cancel
                    </Dialog.CloseTrigger>
                    
                    <button 
                        class="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-30 disabled:hover:bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95" 
                        onclick={handleSubmit} 
                        disabled={!text.trim()}
                    >
                        Confirm
                    </button>
                </footer>

            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>