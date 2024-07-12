import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	let formData = await request.formData();
	const error: Record<string, string> = {};

	if (formData.get("username") === "") {
		error.username = "Please enter your username";
	}

	if (formData.get("password") === "") {
		error.password = "Please enter your password";
	}

	if (Object.values(error).length) {
		return json({ error });
	} else {
		try {
			return await authenticator.authenticate("user-pass", request, {
				successRedirect: "/module",
				throwOnError: true,
				context: { formData },
			});
		} catch (err) {
			if (err instanceof Response) return err;
			if (err instanceof AuthorizationError) {
				error.authError = err.message;
			}

			return json({ error });
		}
	}
};

export default function login() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex flex-col justify-center content-center">
			<div className="max-w-[1240px] mx-auto bg-[#e8e7e6]  px-24 py-8 rounded-xl shadow-xl">
				<div className="flex flex-col gap-0">
					<h2 className="text-center text-3xl font-bold">Login</h2>
					<div className="flex flex-col gap-6">
						{/* <div className="w-full">
							<button
								className="px-16 py-2 flex gap-4 content-center bg-gray-100/40 hover:bg-gray-100/80 rounded-full mx-auto"
								type="button"
							>
								<span>
									<img
										src="/icons/icons8-google-48.svg"
										width="36x"
										height="36px"
										alt="Google logo"
									/>
								</span>
								<span className="flex content-center flex-wrap">
									Login with Google
								</span>
							</button>
						</div> */}
						{/* <div className="block border-b">
							<p className="mx-auto text-center">or</p>
						</div> */}
						<Form method="post" autoComplete="on">
							{/* <h3 className="text-lg font-semibold text-center">
								Login with your credentials
							</h3> */}
							{actionData?.error?.authError && (
								<p className="text-red-500 font-semibold">
									{actionData?.error?.authError}
								</p>
							)}
							<div className="mt-8 flex flex-col gap-6">
								<div className="flex flex-col gap-2">
									<label className="font-semibold font-sans">Username</label>
									<input
										type="text"
										name="username"
										className="outline-none border-2 border-[#050505] rounded-lg px-4 py-2"
										placeholder="Enter your username here...."
									/>
									{actionData?.error?.username && (
										<p className="text-red-500 text-sm">
											{actionData.error.username}
										</p>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<label className="font-semibold font-sans">Password</label>
									<input
										className="outline-none border-2 border-[#050505] rounded-lg px-4 py-2"
										type="password"
										placeholder="Enter your password here..."
										name="password"
									/>
									{actionData?.error?.password && (
										<p className="text-red-500 text-sm">
											{actionData.error.password}
										</p>
									)}
								</div>
								<button
									className="px-4 py-2 rounded-lg bg-[#cccccc] hover:bg-[#050505] text-white font-semibold"
									type="submit"
								>
									Login
								</button>
							</div>
						</Form>
						<div className="block border-b"></div>
						<div className="flex gap-2">
							<p>Don&apos;t have an account yet? </p>
							<Link to="/signup" className=" text-blue-800 underline">
								Signup
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
