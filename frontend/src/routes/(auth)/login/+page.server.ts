import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import {login} from '$lib/api/auth';

export const actions: Actions = {
	login: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, {message: 'Username and password required', invalid: true });
		}

		let access_token: string;
		const useSecureCookie = url.protocol === 'https:';

		try {
			const response = await login({ username, password });
			access_token = response.access_token;
		} catch (error) {
			return fail(401, {message: 'Invalid credentials', credentials: true });
		}

		cookies.set('access_token', access_token, {
			path: '/',
			httpOnly: true,
			secure: useSecureCookie,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(302, '/drive');
	}
};
