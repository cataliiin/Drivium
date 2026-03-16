import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user_data: {
      is_logged_in: locals.is_logged_in ?? false,
      username: locals.user?.username ?? '',
      user_id: locals.user?.user_id ?? ''
    }
  };
};
