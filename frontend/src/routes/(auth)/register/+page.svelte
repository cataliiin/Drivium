<script>
    import { enhance } from '$app/forms';
</script>

<form use:enhance method="POST" action="?/register" class="flex flex-col gap-4 w-full">
    <fieldset class="space-y-4">
        <input name="username" class="input" type="text" placeholder="Username" required/>
        <input name="email" class="input" type="email" placeholder="Email" required/>
        <input name="password" class="input" type="password" placeholder="Password" required/>
        <input name="confirm_password" class="input" type="password" placeholder="Confirm Password" required/>

        <label class="flex items-center space-x-2">
		    <input class="checkbox" type="checkbox" required/>
		    I agree to the <a href="/privacy-policy" class="text-primary-500 p-2 hover:underline">Privacy Policy</a>
	    </label>

    </fieldset>
    <fieldset class="flex justify-left">
        <button type="submit" class="btn flex-1 preset-outlined-surface-300-700">Register</button>
        <a href="/login" class="btn flex-1 preset-ghost-surface w-full text-center no-underline">Login instead</a>
    </fieldset>
</form>