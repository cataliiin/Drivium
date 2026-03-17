<script lang="ts">
	import '../layout.css';

	let { children } = $props();
</script>

<div class="flex justify-center min-h-screen items-center">
    <form class="w-full max-w-md space-y-4 p-4">
        <p class="text-4xl font-bold mb-6">Drivium</p>
        {@render children()}
    </form>
</div>

