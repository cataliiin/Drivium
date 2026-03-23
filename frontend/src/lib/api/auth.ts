import { api } from '$lib/api/client';
import type { Token, UserLogin } from '$lib/api/contracts';
import { handleApiError } from '$lib/utils/errorHandling';

export async function login(payload: UserLogin): Promise<Token> {
	const { data, error } = await api.POST('/auth/login', {
		body: payload
	});

	if (error) handleApiError(error, "Login failed")


	return data as Token;
}
