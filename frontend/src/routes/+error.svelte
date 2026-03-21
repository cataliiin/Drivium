<script>
    import './layout.css';
    import { Home, ArrowLeft } from '@lucide/svelte';
    import { fade, fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
</script>

<div class="min-h-screen w-screen bg-surface-950 flex flex-col justify-center items-center overflow-hidden relative font-sans select-none antialiased">
    
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[100px]"></div>
    </div>

    <main class="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-12">
        
        <div class="flex flex-col items-center space-y-6" in:fly={{ y: -30, duration: 800, easing: backOut }}>

            <h1 class="logo-text text-[150px] font-black leading-none tracking-tighter antialiased">
                404
            </h1>
        </div>

        <div class="flex flex-col items-center space-y-10 max-w-lg" in:fade={{ delay: 400, duration: 600 }}>
            
            <div class="space-y-3">
                <h2 class="text-2xl font-bold text-white tracking-tight">
                    Lost in the Cloud?
                </h2>
    
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                
                <button 
                    onclick={() => history.back()}
                    class="group flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-medium rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.03] transition-all w-full sm:w-auto"
                >
                    <ArrowLeft size={16} class="transition-transform group-hover:-translate-x-1" />
                    Go Back
                </button>

                <a 
                    href="/"
                    class="flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-bold rounded-xl bg-primary-500 text-white shadow-xl shadow-primary-500/15 hover:bg-primary-400 transition-all active:scale-[0.98] w-full sm:w-auto"
                >
                    <Home size={17} />
                    Return Home
                </a>
            </div>
        </div>
    </main>

    <footer class="absolute bottom-6 left-0 w-full text-center z-10 px-6" in:fade={{ delay: 1000, duration: 600 }}>
        <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 antialiased">
            Drivium
        </p>
    </footer>

</div>

<style>
    .logo-text {
        background: linear-gradient(to bottom right, #FFFFFF 50%, rgba(255,255,255,0.1) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-decoration: none;
    }
</style>