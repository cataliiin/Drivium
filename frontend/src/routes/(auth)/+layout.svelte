<script lang="ts">
    import '../layout.css';
    import Logo from '$lib/components/Logo.svelte';
    let { children } = $props();
</script>

<div class="min-h-screen w-full bg-surface-950 flex flex-col justify-center items-center relative overflow-hidden p-4">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-[400px] relative z-10">
        <div class="text-center mb-10">
            <Logo size={60} showDot={true} />
            <p class="text-slate-500 text-sm font-medium mt-2 tracking-wide uppercase opacity-50">Cloud Storage Engineered</p>
        </div>

        <div class="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
            {@render children()}
        </div>

    </div>
</div>