<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";

    let { data } = $props();
</script>

<div class="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 selection:bg-primary-500/30">
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]"></div>
    </div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">
        
        <div class="flex justify-center mb-12">
            <Logo size={32} />
        </div>

        <div class="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2rem] p-10 shadow-2xl">
            <div class="space-y-10">
                
                <div class="space-y-2">
                    <span class="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">
                        Username
                    </span>
                    <div class="text-lg font-medium opacity-80 pb-2">
                        {data.user.username}
                    </div>
                </div>

                <div class="space-y-2">
                    <span class="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">
                        Contact Email
                    </span>
                    <div class="text-lg font-medium opacity-80 pb-2">
                        {data.user.email}
                    </div>
                </div>

                <div class="space-y-2">
                    <span class="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">
                        Account Created
                    </span>
                    <div class="text-lg font-medium opacity-80 pb-2">
                        {new Date(data.user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>


            </div>
        </div>

        <div class="mt-10 px-4 text-center">
            <p class="text-slate-500 text-[11px] leading-relaxed font-medium">
                
                To request account deletion or any profile modifications, please contact: 
                <a href="mailto:drivium.cloud@gmail.com" class="text-white hover:text-primary-400 transition-colors decoration-white/20">
                    drivium.cloud@gmail.com
                </a>
            </p>
        </div>

    </div>
</div>
