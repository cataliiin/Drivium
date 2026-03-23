<script>
    import { enhance } from '$app/forms';
    import { UserPlus } from '@lucide/svelte';
    import { toastService } from '$lib/services/toastService.svelte';
    import { goto } from '$app/navigation';

    const handleRegister = () => {
        return async ({ result }) => {
            if (result.type === 'failure') {
                toastService.create({
                    title: 'Registration Error',
                    description: result.data?.message,
                    type: 'error'
                });
            }

            if (result.type === 'redirect') {
                toastService.success({
                    title: 'Registration Successful',
                    closable: false,
                });
                
                await goto(result.location);
            }
        };
    };
</script>

<div class="space-y-6">
    <header>
        <h2 class="text-xl font-bold text-white tracking-tight">Get started</h2>
        <p class="text-slate-400 text-sm">Create your secure vault in seconds.</p>
    </header>

    <form use:enhance={handleRegister} method="POST" action="?/register" class="flex flex-col gap-5 w-full">
        <div class="space-y-3">
            <input name="username" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" type="text" placeholder="Username" required/>
            <input name="email" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" type="email" placeholder="Email" required/>
            <input name="password" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" type="password" placeholder="Password" required/>
            <input name="confirm_password" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10" type="password" placeholder="Confirm Password" required/>

            <label class="flex items-start space-x-3 p-2 cursor-pointer group">
                <input class="w-5 h-5 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/20 mt-0.5 transition-all" type="checkbox" required/>
                <span class="text-xs text-slate-400 group-hover:text-slate-300 leading-tight">
                    I agree to the <a href="/privacy-policy" class="text-primary-500 hover:text-primary-400 font-bold underline decoration-primary-500/30 transition-colors">Privacy Policy</a> and <a href="/terms-of-service" class="text-primary-500 hover:text-primary-400 font-bold underline decoration-primary-500/30 transition-colors">Terms of Service</a>
                </span>
            </label>
        </div>

        <button type="submit" class="w-full py-4 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
            <UserPlus size={18} />
            Register
        </button>

        <a href="/login" class="text-center text-sm text-slate-500 hover:text-white transition-colors font-medium">
            Already have an account? <span class="text-primary-500 font-bold">Login</span>
        </a>
    </form>
</div>