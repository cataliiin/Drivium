import { request } from "../client";

export function registerUser({ username, email, password }) {
	return request("/users/register", {
		method: "POST",
		json: { username, email, password },
		auth: false,
	});
}

export function getCurrentUser() {
	return request("/users/me");
}
