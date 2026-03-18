import { api } from '$lib/api/client';

export async function health(): Promise<any> {
    const { data } = await api.GET('/health', {});

    return data;
}
