// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				username: string;
				user_id: string;
			};
			is_logged_in: boolean;
		}
		
		interface UserData {
		user_data?: {
			is_logged_in: boolean;
			username: string;
			user_id: string;
		};
		}

		interface PageData extends UserData {
			form?: any;
			}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
