import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { registerUser } from '$lib/api/users';
import { login } from '$lib/api/auth';

export const actions: Actions = {
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        
        const username = data.get('username')?.toString();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();
        const confirm_password = data.get('confirm_password')?.toString();

        if (!username || !password || !email || !confirm_password) {
            return fail(400, { message: 'All fields are required', invalid: true });
        }

        if (password !== confirm_password) {
            return fail(400, { message: 'Passwords do not match', invalid: true });
        }

        try {
            await registerUser({ username, email, password });
            
            const authResponse = await login({ username, password });
            
            if (!authResponse?.access_token) {
                return fail(500, { message: 'Auto-login failed' });
            }

            cookies.set('access_token', authResponse.access_token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            });

        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
            return fail(error.status || 400, { message: errorMessage, registration: true });
        }

        throw redirect(303, '/drive');
    }
};