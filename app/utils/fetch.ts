import { BACKEND_URL } from "./constants";

export async function getData<T>(endpoint: string): Promise<T> {
	const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
		headers: {
			"Content-type": "application/json",
		},
	});

	if (res.status === 400) {
		throw new Error("Bad request");
	}

	if (res.status === 403) {
		throw new Error("You're not authorized to view this information");
	}

	return await res.json();
}

export async function getProtectedData<T>(
	endpoint: string,
	token: string
): Promise<T> {
	const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
		headers: {
			"Content-type": "application/json",
			authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 400) {
		throw new Error("Bad request");
	}

	if (res.status === 403) {
		throw new Error("You're not authorized to view this information");
	}

	return await res.json();
}
