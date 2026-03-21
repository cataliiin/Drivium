<script lang="ts">
    import { HardDrive, LogOut, User2Icon, ChevronDown } from '@lucide/svelte';
    import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
    import Logo from '$lib/components/Logo.svelte';
    import { enhance } from '$app/forms';

    let { is_logged_in } = $props();
</script>

<AppBar class="bg-surface-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[40]">
    <AppBar.Toolbar class="grid-cols-[auto_1fr_auto] items-center px-6 md:px-12 py-3">
        
        <AppBar.Lead>
            <Logo size={28} showDot={true} />
        </AppBar.Lead>

        <AppBar.Headline></AppBar.Headline>

        <AppBar.Trail>
            <div class="flex items-center gap-8">
                {#if is_logged_in}
                    <a href="/drive" class="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary-500 transition-all">
                        <HardDrive size={18} strokeWidth={2.5} />
                        <span class="hidden sm:inline">My Drive</span>
                    </a>
                    
                    <Menu positioning={{ strategy: 'fixed', placement: 'bottom-end', gutter: 12 }}>
                        <Menu.Trigger class="flex items-center gap-1 text-sm font-medium opacity-70 hover:opacity-100 transition-all outline-none">
                            <span>Account</span>
                            <ChevronDown size={14} class="opacity-50" />
                        </Menu.Trigger>
                        
                        <Portal>
                            <Menu.Positioner class="z-[9999]">
                                <Menu.Content class="min-w-[200px] z-[9999] relative">
                                    
                                    <Menu.Item value="settings" class="flex items-center w-full px-3 py-2 rounded-lg hover:bg-surface-800 transition-colors cursor-pointer group">
                                        <a href="/account" class="text-sm flex-1 text-left">My Account</a>
                                        <User2Icon size={16} class="opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </Menu.Item>

                                    <hr class="border-white/5 my-1" />

                                    <Menu.Item value="logout" class="relative w-full group">
                                        <div class="flex items-center w-full px-2 py-2 rounded-lg hover:bg-error-500/10 text-error-500 transition-colors">
                                            <span class="text-sm flex-1 text-left font-medium">Logout</span>
                                            <LogOut size={16} class="shrink-0" />
                                        </div>
                                        <form method="POST" action="/logout?/logout" use:enhance class="absolute inset-0">
                                            <button type="submit" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"></button>
                                        </form>
                                    </Menu.Item>

                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu>
                {:else}
                    <a href="/login" class="text-sm font-medium opacity-60 hover:opacity-100 transition-all">
                        Login
                    </a>
                    <a href="/register" class="text-sm font-bold text-primary-500 hover:text-primary-400 transition-all">
                        Register
                    </a>
                {/if}
            </div>
        </AppBar.Trail>
    </AppBar.Toolbar>
</AppBar>

<style>
    :global(.app-bar), :global(.app-bar-toolbar) {
        overflow: visible !important;
    }
</style>