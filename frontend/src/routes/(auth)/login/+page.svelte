<script>
    import { enhance } from '$app/forms';
    import { LogIn } from '@lucide/svelte';
    
</script>

<div class="space-y-6">
    <header>
        
        <h2 class="text-xl font-bold text-white tracking-tight">Welcome back</h2>
        <p class="text-slate-400 text-sm">Enter your details to access your drive.</p>
    </header>

    <form use:enhance method="POST" action="?/login" class="flex flex-col gap-5 w-full">
        <div class="space-y-4">
            <input 
                name="username" 
                class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" 
                type="text" 
                placeholder="Username" 
                required
            />
            <input 
                name="password" 
                class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" 
                type="password" 
                placeholder="Password" 
                required
            />
        </div>

        <button type="submit" class="w-full py-4 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
            <LogIn size={18} />
            Login
        </button>
        
        <div class="relative py-2 text-center">
            <span class="absolute inset-x-0 top-1/2 h-px bg-white/10"></span>
            <span class="relative bg-surface-900 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">OR</span>
        </div>

        <a href="/register" class="w-full py-3 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold rounded-xl text-center transition-all text-sm">
            Create an account
        </a>
    </form>
</div>