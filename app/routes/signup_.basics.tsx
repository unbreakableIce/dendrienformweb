import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import Container2 from "~/components/layout/Container2";
import { getSession, commitSession } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();
	const { _action, ...values } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/signup");
	}

	if (_action === "next") {
		const firstname = data.get("firstname") as string;
		const lastname = data.get("lastname") as string;
		const email = data.get("email") as string;
		const gender = data.get("gender") as string;
		const location = data.get("location") as string;
		const birthdate = data.get("birthdate") as string;

		const error: Record<string, string> = {};

		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		if (firstname === "") {
			error.firstname = "You must enter a first name to continue";
		}

		if (lastname === "") {
			error.lastname = "You must enter a last name to continue";
		}

		if (email === "" || !email?.toString().match(emailRegex)) {
			error.email =
				"You must enter a valid email in the format: example@xyz.com";
		}

		if (birthdate === "") {
		//	error.birthdate = "You must enter your birthdate to continue";
		}

		if (location === "") {
			error.location = "You must enter a location to continue";
		}

		const userBasics = {
			firstname,
			lastname,
			email,
			gender,
			birthdate,
			location,
		};

		if (Object.values(error).length > 0) {
			return json({ error });
		} else {
			const session = await getSession(request.headers.get("cookie"));
			session.flash("userbasics", userBasics);
			return redirect("/signup/credentials", {
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
		firstname: string;
		lastname: string;
		email: string;
		gender: string;
		location: string;
		birthdate: string;
	} = session.get("userbasics") || {};

	return json(
		{ user },
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}
	);
};

export default function SignupBasics() {
	const { user } = useLoaderData<typeof loader>();
	const data = useActionData<typeof action>();

	return (
		<Container2 pageTitle="Basic information">
			<div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">
							First Name
						</label>
						<input
							type="text"
							name="firstname"
							defaultValue={user.firstname}
							form="valuesForm"
							placeholder="Please enter your first name"
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
						/>
						{data?.error?.firstname && (
							<p className="text-red-500 text-lg text-left">
								{data.error.firstname}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">Last Name</label>
						<input
							type="text"
							name="lastname"
							defaultValue={user.lastname}
							form="valuesForm"
							placeholder="Please enter your last name"
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
						/>
						{data?.error?.lastname && (
							<p className="text-red-500 text-lg text-left">
								{data.error.lastname}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">Email</label>
						<input
							type="text"
							name="email"
							defaultValue={user.email}
							form="valuesForm"
							placeholder="Please enter your email"
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
						/>
						{data?.error?.email && (
							<p className="text-red-500 text-lg text-left">
								{data.error.email}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">Gender</label>
						<select
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
							defaultValue={user.gender}
							form="valuesForm"
							name="gender"
						>
							<option value="">Please indicate your gender: </option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="non-binary">Nonbinary</option>
							<option value="other">Other</option>
							<option value="no-answer">Prefer not to answer</option>
						</select>
					</div>
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">Location</label>
						<input
							type="text"
							name="location"
							defaultValue={user.location}
							form="valuesForm"
							placeholder="Please enter your location"
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
						/>
						{data?.error?.location && (
							<p className="text-red-500 text-lg text-left">
								{data.error.location}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-4 pb-8">
						<label className="font-semibold text-2xl text-left">
							Birthdate
						</label>
						<input
							type="date"
							name="birthdate"
							defaultValue={user.birthdate}
							form="valuesForm"
							placeholder="Please enter your birthdate"
							className="px-4 py-2 outline-none border-b-2 border-[#802E34] bg-transparent placeholder:text-gray-800"
						/>
						{/*}	{data?.error?.birthdate && (
							<p className="text-red-500 text-lg text-left">
								{data.error.birthdate}
							</p>
						)}    */}
					</div>
				</div>
			</div>
		</Container2>
	);
}
