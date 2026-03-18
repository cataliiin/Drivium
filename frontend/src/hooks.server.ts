import { error, type Handle } from '@sveltejs/kit';
import { JWT_SECRET_KEY } from '$env/static/private';
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
			const payload = jwt.verify(
				event.cookies.get('access_token')!, 
				JWT_SECRET_KEY!
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
