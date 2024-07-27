import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { MouseEvent, useState } from "react";
import ChoiceButton from "~/components/shared/ChoiceButton";
import { commitSession, getSession } from "~/utils/session.server";
import { v4 as uuidv4 } from "uuid";
import redis from "~/utils/connection";
import { authenticator } from "~/utils/auth.server";
import * as argon2 from 'argon2';


export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();
	const { _action, ...values } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/signup/credentials");
	}

	if (_action === "next") {
		const selection = data.get("selection");

		const error: Record<string, string> = {};

		if (selection === "" || selection === "0") {
			error.selection = "Please select one to continue";
		}

		if (Object.values(error).length > 0) {
			return json({ error });
		} else {
			const session = await getSession(request.headers.get("cookie"));

			// generate a random user ui

			// get all the previous values
			// if one value is missing, tell the user to go back and put it
			const basics: {
				firstname: string;
				lastname: string;
				email: string;
				gender: string;
				birthdate: string;
				location: string;
			} = session.get("userbasics");

			const credentials: { username: string; password: string } =
				session.get("credentials");

			const user = {
				userId: uuidv4(),
				firstname: basics.firstname,
				lastname: basics.lastname,
				username: credentials.username,
				email: basics.email,
				birthdate: basics.birthdate,
				location: basics.location || '',
				password: await argon2.hash(credentials.password),
				gender: basics.gender || "",
				choice: selection,
			};

			// store the hash in redis with the username as key
			await redis.hset(user.username, user);

			const formData = new FormData();

			formData.append("username", user.username);
			formData.append("password", credentials.password);

			await authenticator.authenticate("user-pass", request, {
				successRedirect: "/home",
				context: { formData },
			});

			return redirect("/home", {
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			});
		}
	}
};

export default function Choice() {
	const err = useActionData<typeof action>();

	const [selected, setselected] = useState<number>(0);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		console.log(`Choice selected =${e.currentTarget.value}`);

		setselected(parseInt(e.currentTarget.value));
	};

	return (
		<div className="mx-auto py-16 w-full max-w-[640px]  bg-[#e8e7e6] rounded-xl shadow-md px-8 mb-16">
			<Form
				method="post"
				autoComplete="off"
				className="h-full flex flex-col justify-between content-center flex-wrap"
			>
				<div className="flex flex-col flex-wrap gap-4 content-center pb-12">
					<label className="font-semibold text-2xl text-center">
						What do you hope to get from this experience?{" "}
					</label>
					<div className="mx-auto flex flex-wrap items-center justify-center">
						<ChoiceButton
							id={1}
							title="Self Discovery"
							//description="Examining yourself requires constant self-awareness and self-consciousness.
							description=" "
							handleClick={handleClick}
							isSelected={selected === 1}
							image="/icons/icons8-meditation-64.png"
						/>
						<ChoiceButton
							id={2}
							title="Personal Development"
							//description="Personal development is a vital part of an individual's growth and progression."
							description=" "
							handleClick={handleClick}
							isSelected={selected === 2}
							image="/icons/icons8-personal-development-68.png"
						/>
						<ChoiceButton
							id={3}
							title="Career Development"
							//description="The better you  understand what expertise you have and what you want in a career,
							//the more equipped you are to find your place in the work world.."
							description=" "
							handleClick={handleClick}
							isSelected={selected === 3}
							image="/icons/bullseye-arrow.svg"
						/>
						<ChoiceButton
							id={4}
							title="Fun distraction from the work I am supposed to be doing now"
							//description="The urge to explore and seek novelty helps us remain vigilant and gain knowledge about our constantly changing environment."
							description=" "
							handleClick={handleClick}
							isSelected={selected === 4}
							image="/icons/icons8-child-100.png"
						/>
						{err?.error?.name && (
							<p className="text-red-500 text-lg">{err.error.name}</p>
						)}
					</div>
				</div>
				<div className="w-full px-6 flex justify-between">
					<input
						type="hidden"
						name="selection"
						value={selected?.toString() || ""}
					/>
					<button
						name="_action"
						value="back"
						className="outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg transition flex gap-4 items-center flex-wrap group"
					>
						<ArrowLongLeftIcon className="h-8 text-[#802E34] group-hover:-translate-x-6 transition duration-150" />
						Back
					</button>
					<button
						name="_action"
						value="next"
						className="outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg transition flex gap-4 items-center flex-wrap group"
					>
						Start your journey
						<ArrowLongRightIcon className="h-8 text-[#802E34] group-hover:translate-x-6 transition duration-150" />
					</button>
				</div>
			</Form>
		</div>
	);
}
