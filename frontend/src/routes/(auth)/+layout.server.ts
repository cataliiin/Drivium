import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.is_logged_in) {
		throw redirect(302, '/');
	}
	return {
		user: locals.user
	};
};
