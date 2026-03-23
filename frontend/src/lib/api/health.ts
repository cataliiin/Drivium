import { api } from '$lib/api/client';
import { handleApiError } from '$lib/utils/errorHandling';

export async function health(): Promise<any> {
    const { data, error } = await api.GET('/health', {});

    if (error) handleApiError(error, "Health check failed")

    return data;
}
