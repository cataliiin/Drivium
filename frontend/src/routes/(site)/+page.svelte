<script lang="ts">
    import { 
        HardDrive, 
        Lock, 
        Code2, 
        Database, 
        Zap,
        Github,
        DatabaseZap,
        GitBranch,
        FileText
    } from '@lucide/svelte';
    import Logo from '$lib/components/Logo.svelte';

    let { data } = $props();
    
    let isLoggedIn = $derived(data.user_data?.is_logged_in ?? false);
</script>

<svelte:head>
    <title>Drivium - Cloud Storage</title>
    <meta name="description" content="FastAPI + SvelteKit cloud storage. Secure, rapid, open source." />
</svelte:head>

<header class="min-h-[85vh] flex items-center relative overflow-hidden bg-surface-50-945">
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
            <div class="flex justify-center mb-10">
                <Logo size={110} showDot={true} />

            </div>

            <p class="text-xl md:text-2xl mb-12 opacity-70 leading-relaxed font-light max-w-2xl mx-auto">
                High-performance cloud storage<br> engineered with <span class="text-primary-500 font-medium">FastAPI</span> and <span class="text-secondary-500 font-medium">SvelteKit</span>.
            </p>

            <div class="flex flex-wrap gap-4 justify-center items-center mb-16">
                {#if isLoggedIn}
                    <a href="/drive" class="btn btn-xl preset-filled-primary-500 shadow-xl group px-10">
                        <HardDrive class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Go to My Drive
                    </a>
                {:else}
                    <a href="/register" class="btn btn-xl preset-filled-primary-500 shadow-xl px-12">Get Started</a>
                   <a href="/login" class="btn btn-xl border-2 border-surface-500 px-12">Login</a>
                {/if}
            </div>

            <div class="flex flex-wrap gap-3 justify-center items-center">
                <div class="badge variant-soft-surface py-2 px-4 border border-surface-500/20 flex gap-2">
                    <Code2 size={16} class="text-purple-400" /> 
                    <span class="opacity-80">FastAPI</span>
                </div>
                <div class="badge variant-soft-surface py-2 px-4 border border-surface-500/20 flex gap-2">
                    <Database size={16} class="text-blue-400" /> 
                    <span class="opacity-80">Postgres + MinIO</span>
                </div>
                <div class="badge variant-soft-surface py-2 px-4 border border-surface-500/20 flex gap-2">
                    <Zap size={16} class="text-orange-500" /> 
                    <span class="opacity-80">SvelteKit</span>
                </div>
            </div>
        </div>
    </div>
</header>

<section class="py-24 bg-surface-100-800 border-t border-surface-500/5">
    <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div class="card p-8 bg-surface-50-945 border border-surface-500/10">
                <header class="mb-6">
                    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-500/20 text-primary-500">
                        <DatabaseZap size={24} />
                    </div>
                </header>
                <h3 class="text-xl font-bold mb-3">S3 Object Storage</h3>
                <p class="opacity-70 text-sm leading-relaxed">Built on MinIO for high-performance BLOB storage. Optimized for consistency and rapid I/O operations.</p>
            </div>

            <div class="card p-8 bg-surface-50-945 border border-surface-500/10">
                <header class="mb-6">
                    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary-500/20 text-secondary-500">
                        <GitBranch size={24} />
                    </div>
                </header>
                <h3 class="text-xl font-bold mb-3">Relational Metadata</h3>
                <p class="opacity-70 text-sm leading-relaxed">PostgreSQL-backed folder structures ensuring atomic operations and directory tree traversal.</p>
            </div>

            <div class="card p-8 bg-surface-50-945 border border-surface-500/10">
                <header class="mb-6">
                    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-tertiary-500/20 text-tertiary-500">
                        <Lock size={24} />
                    </div>
                </header>
                <h3 class="text-xl font-bold mb-3">Secure Sessions</h3>
                <p class="opacity-70 text-sm leading-relaxed">JWT authentication via HttpOnly cookies. Private access protected by industry-standard security layers.</p>
            </div>

        </div>
    </div>
</section>

<section class="py-20 bg-surface-50-945 border-t border-surface-500/5">
    <div class="container mx-auto px-6">
        <div class="card p-12 max-w-4xl mx-auto bg-gradient-to-b from-surface-500/5 to-transparent border border-surface-500/10 flex flex-col items-center text-center">
            <div class="bg-surface-900 rounded-full p-4 mb-6 shadow-2xl border border-surface-500/20">
                <Github size={48} />
            </div>
            <h2 class="text-3xl font-bold mb-4 text-white">Open Source</h2>
            <p class="opacity-70 mb-8 max-w-lg">Explore the code or deploy your own instance.</p>
            <a href="https://github.com/cataliiin/Drivium" target="_blank" rel="noopener noreferrer" class="btn preset-filled-surface-500 font-bold px-8">
                <Github size={18} class="mr-2" /> View Repository
            </a>
        </div>
    </div>
</section>

<footer class="py-16 bg-surface-100-800 border-t border-surface-500/10">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-18 max-w-6xl mx-auto">
            
            <div class="col-span-1 md:col-span-1">
                <div class="mb-4"> <Logo size={30} showDot={true} />
                </div>
                <p class="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
                    Cloud Storage Engineered
                </p>
            </div>

            <div>
                <h4 class="text-xs font-bold uppercase tracking-widest mb-4 opacity-40">Core Stack</h4>
                <ul class="space-y-2 text-sm opacity-70">
                    <li class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-primary-500 rounded-full"></span> SvelteKit 5
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-primary-500 rounded-full"></span> FastAPI
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-primary-500 rounded-full"></span> PostgreSQL
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="w-1 h-1 bg-primary-500 rounded-full"></span> MinIO S3 Storage
                    </li>
                </ul>
            </div>

            <div class="flex flex-col gap-4">
                <h4 class="text-xs font-bold uppercase tracking-widest mb-4 opacity-40">Resources</h4>
                <a href="https://github.com/cataliiin/Drivium" target="_blank" class="text-sm hover:text-primary-500 transition-colors flex items-center gap-2">
                    <Github size={14} /> Source Code
                </a>
                <a href="/privacy-policy" class="text-sm hover:text-primary-500 transition-colors flex items-center gap-2">
                    <Lock size={14} /> Privacy Policy
                </a>
                <a href="/terms-of-service" class="text-sm hover:text-primary-500 transition-colors flex items-center gap-2">
                    <FileText size={14} /> Terms of Service
                </a>
            </div>
        </div>

        <div class="mt-16 pt-8 border-t border-surface-500/5 flex flex-col md:row justify-between items-center gap-4">

            <p class="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} Drivium Project
            </p>
            
        </div>
    </div>
</footer>
