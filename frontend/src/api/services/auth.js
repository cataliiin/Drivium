import { request, setAccessToken, clearAccessToken } from "../client";

export async function login({ username, password }) {
	const data = await request("/auth/login", {
		method: "POST",
		json: { username, password },
		auth: false,
	});

	if (data?.access_token) {
		setAccessToken(data.access_token);
	}

	return data;
}

export function logout() {
	clearAccessToken();
}
