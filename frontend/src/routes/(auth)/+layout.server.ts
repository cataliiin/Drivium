import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.is_logged_in) {
    throw redirect(302, '/drive');
  }
  
  return {};
};
