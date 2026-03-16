import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parent_data = await parent() as App.UserData;

  if (parent_data.user_data && parent_data.user_data.is_logged_in) {
    throw redirect(302, '/');
  }

  return {
    ...parent_data
  };
};
