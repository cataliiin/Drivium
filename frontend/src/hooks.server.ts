import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import {health} from '$lib/api/health';

export const handle: Handle = async ({ event, resolve }) => {
	try {
        const healthResponse = await health();
        if (!(healthResponse.status == "ok")) {
			return error(503, {
				message: "Backend service is currently unavailable. Please try again later."
			});
		}
        
    } catch (err) {
        return error(503, {
            message: "Backend service is currently unavailable.	Please try again later."
        });
    }


	event.locals.is_logged_in = !!event.cookies.get('access_token');

	if (event.locals.is_logged_in) {
		try {
			const jwtSecret = env.JWT_SECRET_KEY;
			if (!jwtSecret) {
				event.cookies.delete('access_token', { path: '/' });
				event.locals.is_logged_in = false;
				return resolve(event);
			}

			const payload = jwt.verify(
				event.cookies.get('access_token')!, 
				jwtSecret
			) as any;
			event.locals.user = {
				user_id: payload.user_id,
				username: payload.username
			};
		} catch {
			event.cookies.delete('access_token', { path: '/' });
			event.locals.is_logged_in = false;
		}
	}

	return resolve(event);
};
