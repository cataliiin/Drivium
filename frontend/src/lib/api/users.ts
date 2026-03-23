import { api } from '$lib/api/client';
import type { UserCreate, UserResponse } from '$lib/api/contracts';
import { handleApiError } from '$lib/utils/errorHandling';

export async function registerUser(payload: UserCreate): Promise<UserResponse> {
	const { data, error } = await api.POST('/users/register', {
		body: payload
	});

	if (error) handleApiError(error, "User registration failed")

	return data as UserResponse;
}

export async function getCurrentUser(): Promise<UserResponse> {
    const { data, error } = await api.GET('/users/me');
	if (error) handleApiError(error, "Failed to fetch current user")
    return data as UserResponse;
}

