<script>
    import { enhance } from '$app/forms';
</script>


<form use:enhance method="POST" action="?/login" class="flex flex-col gap-4 w-full">
    <fieldset class="space-y-4">
        <input name="username" class="input" type="text" placeholder="Username" required/>
        <input name="password" class="input" type="password" placeholder="Password" required/>
    </fieldset>
    <fieldset class="flex justify-left">
        <button type="submit" class="btn preset-outlined-surface-300-700">Login</button>
        <a href="/register" class="btn preset-ghost-surface w-full text-center no-underline">Create an Account</a>
    </fieldset>
</form>
