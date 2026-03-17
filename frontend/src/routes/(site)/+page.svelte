<script lang="ts">
	import { 
		HardDrive, 
		Upload, 
		Share2, 
		Lock, 
		Code2, 
		Database, 
		ArrowRight 
	} from '@lucide/svelte';

	let { data } = $props();
	
	let isLoggedIn = $derived(data.user_data?.is_logged_in ?? false);
	let username = $derived(data.user_data?.username ?? '');
</script>

<svelte:head>
	<title>Drivium - Cloud Storage</title>
	<meta name="description" content="FastAPI + SvelteKit cloud storage. Secure, rapid, open source." />
</svelte:head>

<section class="min-h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden flex items-center">
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
		<div class="absolute bottom-32 left-20 w-96 h-96 bg-blue-500/5 rounded-3xl blur-2xl animate-pulse delay-1000"></div>
	</div>

	<div class="container mx-auto px-6 relative z-10">
		<div class="max-w-5xl mx-auto text-center">
			<h1 class="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
				<span class="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
					Drivium
				</span>
			</h1>

			<p class="text-4xl md:text-3xl mb-12 text-slate-260 max-w-3xl mx-auto leading-relaxed font-light">
				Cloud storage ultra-rapid<br>FastAPI backend + SvelteKit frontend 
			</p>

			<div class="flex flex-col lg:flex-row gap-6 justify-center items-center mb-20">
				{#if isLoggedIn}
					<a href="/drive" class="btn btn-xl preset-filled-surface-500 shadow-2xl group py-4 px-8">
						<HardDrive class="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
						My Drive ({username})
					</a>
				{:else}
					<a href="/register" class="btn btn-xl preset-filled-primary-500 shadow-2xl group text-lg px-12 py-4">
						Create Account
					</a>
					<a href="/login" class="btn btn-xl preset-outline-primary-500 shadow-xl text-lg px-12 py-4 bg-white/5">
						Have an Account
					</a>
				{/if}
			</div>

			<div class="flex flex-wrap gap-6 justify-center items-center opacity-80 mb-8">
				<div class="flex items-center gap-2 text-sm bg-slate-800/50 border border-white/10 px-4 py-2 rounded-full text-white">
					<Code2 class="w-4 h-4 text-purple-400" />
					FastAPI + PostgreSQL
				</div>
				<div class="flex items-center gap-2 text-sm bg-slate-800/50 border border-white/10 px-4 py-2 rounded-full text-white">
					<Database class="w-4 h-4 text-blue-400" />
					MinIO S3
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-32 bg-slate-50">
	<div class="container mx-auto px-6">
		<div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
			<div class="card p-10 border-0 shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-500 bg-white">
				<div class="flex flex-col gap-6">
					<div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg">
						<Upload size={32} />
					</div>
					<h3 class="text-2xl font-black text-slate-900">Fast Uploads</h3>
					<p class="text-slate-600">Drag & drop and chunked uploads.</p>
				</div>
			</div>

			<div class="card p-10 border-0 shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-500 bg-white">
				<div class="flex flex-col gap-6">
					<div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg">
						<Share2 size={32} />
					</div>
					<h3 class="text-2xl font-black text-slate-900">Sharing</h3>
					<p class="text-slate-600">Share files with others via secure links.</p>
				</div>
			</div>

			<div class="card p-10 border-0 shadow-xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 bg-white">
				<div class="flex flex-col gap-6">
					<div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg">
						<Lock size={32} />
					</div>
					<h3 class="text-2xl font-black text-slate-900">Security</h3>
					<p class="text-slate-600">Audit logs and JWT HTTP-only.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-32 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
	<div class="container mx-auto px-6 text-center">
		<h2 class="text-5xl font-black mb-8">Ready to Get Started?</h2>
		<div class="flex flex-col md:flex-row gap-6 justify-center">
			{#if isLoggedIn}
				<a href="/drive" class="btn btn-xl preset-filled-primary-500 px-12 py-4">
					<HardDrive class="w-7 h-7 mr-3" /> My Drive
				</a>
			{:else}
				<a href="/register" class="btn btn-xl preset-filled-secondary-500 px-12 py-4">
					<ArrowRight class="w-7 h-7 mr-3" /> Create Account
				</a>
			{/if}
		</div>
	</div>
</section>
