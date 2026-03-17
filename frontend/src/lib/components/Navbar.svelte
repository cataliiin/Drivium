<script lang="ts">
	import { HardDrive, UserIcon, LogIn, UserRoundPlus, LogOut, Settings } from '@lucide/svelte';
	import { AppBar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';

    let { is_logged_in } = $props();
</script>

<AppBar class="">
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]  opacity-100">
		<AppBar.Lead>
		</AppBar.Lead>
		<AppBar.Headline>
			<p class="text-4xl font-bold">Drivium</p>
		</AppBar.Headline>
		<AppBar.Trail>
        {#if is_logged_in}
			<a href="/drive" type="button" class="btn hover:preset-tonal">My drive<HardDrive class="size-6" /></a>
            <Menu>
                <Menu.Trigger class="btn hover:preset-tonal">Account<UserIcon class="size-6" /></Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="settings" class="w-full">
                            <Menu.ItemText class="w-full">
                                <div class="flex items-center justify-between w-full gap-4">
                                <span>Settings</span>
                                <Settings class="size-6 shrink-0" />
                                </div>
                            </Menu.ItemText>
                            </Menu.Item>

                            <Menu.Separator />

                            <Menu.Item value="logout" class="w-full">
                            <Menu.ItemText class="w-full relative">
                                <div class="flex items-center justify-between w-full gap-4">
                                <span>Logout</span>
                                <LogOut class="size-6 shrink-0" />
                                </div>
                                
                                <form method="POST" action="/logout?/logout" use:enhance class="absolute inset-0">
                                <button type="submit" aria-label="Logout" class="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer opacity-0 hover:opacity-0 active:opacity-0" style="pointer-events: auto;"></button>
                                </form>
                            </Menu.ItemText>
                            </Menu.Item>

                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu>
        {:else}
            <a href="/login" type="button" class="btn hover:preset-tonal">Login<LogIn class="size-6" /></a>
            <div>
                <span class="vr border-l-2"></span>
            </div>
            <a href="/register" type="button" class="btn hover:preset-tonal">Register<UserRoundPlus class="size-6" /></a>
        {/if}
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>