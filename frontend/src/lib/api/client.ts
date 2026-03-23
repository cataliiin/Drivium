import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from '$lib/api/openapi-generated-schema';
import {PUBLIC_API_BASE_URL} from '$env/static/public';

const baseUrl = PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? 'http://localhost:8000';

const middleware: Middleware = {
	async onRequest({ request }) {
		const nextRequest = new Request(request, {
			credentials: 'include'
		});

		if (!nextRequest.headers.has('Accept')) {
			nextRequest.headers.set('Accept', 'application/json');
		}

		return nextRequest;
	},

	async onResponse({ response }) {
		if (response.ok) return response;

		let message = `${response.status} ${response.statusText}`;

		try {
            const data = await response.clone().json();

            if (typeof data?.message === 'string') {
                message = data.message;
            } else if (typeof data?.detail === 'string') {
                message = data.detail;
            } else if (Array.isArray(data?.detail)) {
                const firstError = data.detail[0];
                const field = firstError.loc.at(-1); 
                message = `${field}: ${firstError.msg}`;
            }
        } catch {
        }

		throw new Error(message);
	},

	async onError({ error }) {
		if (error instanceof Error) {
			return new Error(error.message);
		}

		return new Error('Network error');
	}
};

export const api = createClient<paths>({
	baseUrl
});

api.use(middleware);
