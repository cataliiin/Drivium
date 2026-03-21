<script lang="ts">
    interface Props {
        size?: number;
        showDot?: boolean;
    }

    let { size = 24, showDot = true }: Props = $props();
</script>

<a 
    href="/" 
    class="group inline-flex items-baseline no-underline outline-none select-none transition-transform duration-500 ease-out hover:scale-[1.02]"
    style="font-size: {size}px; width: fit-content;"
>
    <span class="font-black tracking-tighter leading-none logo-texture-gradient">
        Drivium
    </span>

    {#if showDot}
        <span 
            class="bg-primary-500 rounded-full inline-block ml-[0.15em]"
            style="
                width: 0.15em; 
                height: 0.15em; 
                margin-bottom: 0.12em;
            "
        ></span>
    {/if}
</a>

<style>
    .logo-texture-gradient {
        background: linear-gradient(-50deg, rgb(48, 48, 48) 0%, rgb(66, 66, 66) 12%, #EEEEEE 85%, #FFFFFF 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        display: inline-block;
    }
</style>