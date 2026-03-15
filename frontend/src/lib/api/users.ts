import { api } from '$lib/api/client';
import type { UserCreate, UserResponse } from '$lib/api/contracts';

export async function registerUser(payload: UserCreate): Promise<UserResponse> {
	const { data } = await api.POST('/users/register', {
		body: payload
	});

	return data as UserResponse;
}

export async function getCurrentUser(): Promise<UserResponse> {
    const { data } = await api.GET('/users/me');
    return data as UserResponse;
}

