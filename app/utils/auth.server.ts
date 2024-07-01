import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { User, UserSession } from "~/Data/types/user";
import { sessionStorage } from "./session.server";
import redis from "./connection";

export let authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form, context }) => {
		const username = form.get("username") as string;
		const password = form.get("password") as string;

		const userData = (await redis.hgetall(username)) as User;
		const user: UserSession = {
			user: userData,
			token: "1234",
		};

		if (!Object.keys(userData).length) {
			throw new Error("User not found");
		}

		if (user.user.password !== password) {
			throw new Error("Incorrect password");
		}

		return user;
	}),
	"user-pass"
);
