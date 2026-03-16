import { type Handle } from '@sveltejs/kit';
import { JWT_SECRET_KEY } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.is_logged_in = !!event.cookies.get('jwt');

	if (event.locals.is_logged_in) {
		try {
			const payload = jwt.verify(
				event.cookies.get('jwt')!, 
				JWT_SECRET_KEY!
			) as any;
			event.locals.user = {
				user_id: payload.user_id,
				username: payload.username
			};
		} catch {
			event.cookies.delete('jwt', { path: '/' });
			event.locals.is_logged_in = false;
		}
	}

	return resolve(event);
};
