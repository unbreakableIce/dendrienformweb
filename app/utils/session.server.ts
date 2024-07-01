import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "session",
		httpOnly: true,
		maxAge: 3600,
		path: "/",
		sameSite: "lax",
		secrets: ["s3cret1"],
		secure: true,
	},
});

export const { getSession, commitSession, destroySession } = sessionStorage;
