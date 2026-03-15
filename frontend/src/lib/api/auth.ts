import { api } from '$lib/api/client';
import type { Token, UserLogin } from '$lib/api/contracts';

export async function login(payload: UserLogin): Promise<Token> {
	const { data } = await api.POST('/auth/login', {
		body: payload
	});

	return data as Token;
}
