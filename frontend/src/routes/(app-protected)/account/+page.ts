import {getCurrentUser} from '$lib/api/users';


export async function load() {
    const user = await getCurrentUser();

    return {
        user
    };
}
