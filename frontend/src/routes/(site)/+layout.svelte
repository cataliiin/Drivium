<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import { page } from '$app/stores';

	let { children } = $props();

	let isLoggedIn = $derived($page.data.user_data?.is_logged_in ?? false);
</script>

<Navbar is_logged_in={isLoggedIn}/>

{@render children()}