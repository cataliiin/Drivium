<script lang="ts">
  import {
    HouseIcon, HardDriveIcon,Trash2, Users, LogOut
  } from '@lucide/svelte';
  import { Navigation } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';


  const linksSidebar = {
    Drives: [
      { label: 'My drive', href: '/#', icon: HardDriveIcon },
      //{ label: 'Shared with me', href: '/#', icon: Users },
      //{ label: 'Trash', href: '/#', icon: Trash2 }

    ]
  };

  let { children } = $props();
</script>

<div class="h-screen w-screen grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800 bg-charcoal-blue-950">
  
  <Navigation layout="sidebar" class="h-full grid grid-rows-[auto_1fr_auto] gap-4">
    <Navigation.Header class="flex pl-2 py-4">
      <a href="/" class="flex" aria-label="Home" title="Drivium Home">
        <p class="text-4xl font-bold">Drivium</p>
      </a>
    </Navigation.Header>
    
    <Navigation.Content>
      <Navigation.Group>
        <Navigation.Menu>
          <Navigation.TriggerAnchor href="/" aria-label="Home">
            <HouseIcon class="size-4" aria-hidden="true" />
            <Navigation.TriggerText>Home</Navigation.TriggerText>
          </Navigation.TriggerAnchor>
        </Navigation.Menu>
      </Navigation.Group>
      
      {#each Object.entries(linksSidebar) as [category, links]}
        <Navigation.Group>
          <Navigation.Label class="capitalize pl-2">{category}</Navigation.Label>
          <Navigation.Menu>
            {#each links as link (link)}
              {@const Icon = link.icon}
              <Navigation.TriggerAnchor 
                href={link.href} 
                title={link.label} 
                aria-label={link.label}
              >
                <Icon class="size-4" aria-hidden="true" />
                <Navigation.TriggerText>{link.label}</Navigation.TriggerText>
              </Navigation.TriggerAnchor>
            {/each}
          </Navigation.Menu>
        </Navigation.Group>
      {/each}
    </Navigation.Content>
    
    <Navigation.Footer>
      <div class="relative">
        <Navigation.TriggerAnchor 
          href="#"
          title="Log Out" 
          aria-label="Log Out"
          class="pointer-events-none"
        >
          <LogOut class="size-4" aria-hidden="true" />
          <Navigation.TriggerText>Log Out</Navigation.TriggerText>
        </Navigation.TriggerAnchor>
        
        <form 
          method="POST" 
          action="/logout?/logout" 
          use:enhance
          class="absolute inset-0 w-full h-full z-10"
        >
          <button 
            type="submit"
            class="absolute inset-0 w-full h-full bg-transparent border-none opacity-0 cursor-pointer"
            aria-label="Log Out"
          ></button>
        </form>
      </div>
    </Navigation.Footer>
  </Navigation>
  
  <div class="h-full overflow-hidden p-0">
    {@render children()}
  </div>
</div>

