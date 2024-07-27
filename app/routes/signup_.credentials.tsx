import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Container2 from "~/components/layout/Container2";
import redis from "~/utils/connection";
import { commitSession, getSession } from "~/utils/session.server";
import * as argon2 from 'argon2';

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();
	const { _action, ...values } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/signup/basics");
	}

	if (_action === "next") {
		const password = data.get("password") as string;
		const confirmation = data.get("confirmation") as string;
		const username = data.get("username") as string;
		const exist = await redis.keys(username);

		const error: Record<string, string> = {};

		if (password !== confirmation) {
			error.password = "The password and the confirmation don't match";
		}

		if (password.length < 8) {
			error.passwordlength = "The password must be at least 8 characters.";
		}

		if (username === "") {
			error.username = "You must enter a username to continue";
		}

		if (exist.length > 0) {
			error.username =
				"This username already exists, please choose another one";
		}

		// const hash = await argon2.hash(password);

		const credentials = { username: username, password: password };


		if (Object.values(error).length > 0) {
			return json({ error });
		} else {
			const session = await getSession(request.headers.get("cookie"));
			session.flash("credentials", credentials);
			return redirect("/signup/choices", {
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			});
		}
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("cookie"));

	const user: {
		username: string;
		password: string;
	} = session.get("credentials") || {};

	return json(
		{ user },
		{ headers: { "Set-Cookie": await commitSession(session) } }
	);
};

export default function SignupCredentials() {
	const { user } = useLoaderData<typeof loader>();
	const err = useActionData<typeof action>();

	return (
		<Container2 pageTitle="Create Login">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4 pb-8 text-left">
					<label className="font-semibold text-2xl">
						Please choose a username:{" "}
					</label>
					<input
						type="text"
						name="username"
						defaultValue={user.username}
						form="valuesForm"
						placeholder="Please enter your username"
						className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
					/>
					{err?.error?.username && (
						<p className="text-red-500 text-lg">{err.error.username}</p>
					)}
				</div>
				<div className="flex flex-col gap-4 pb-8 text-left">
					<label className="font-semibold text-2xl">
						Please choose a password:{" "}
					</label>
					<input
						type="password"
						name="password"
						defaultValue={user.password}
						form="valuesForm"
						placeholder="Please enter your password"
						className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
					/>
					{err?.error?.passwordlength && (
						<p className="text-red-500 text-lg">{err.error.passwordlength}</p>
					)}
				</div>
				<div className="flex flex-col gap-4 pb-8 text-left">
					<label className="font-semibold text-2xl">
						Confirm your password:{" "}
					</label>
					<input
						type="password"
						name="confirmation"
						defaultValue={user.password}
						form="valuesForm"
						placeholder="Please confirm your password"
						className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
					/>
					{err?.error?.password && (
						<p className="text-red-500 text-lg">{err.error.password}</p>
					)}
				</div>
			</div>
		</Container2>
	);
}
