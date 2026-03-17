import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { LayoutServerLoad } from '../(site)/$types';

export const load: LayoutServerLoad = async ({}) => {
  redirect(302, '/');
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('access_token', { path: '/' });
    throw redirect(302, '/');
  }
};