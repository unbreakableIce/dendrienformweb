import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";

export const meta: MetaFunction = () => {
	return [
		{ title: "signup" },
		{ name: "description", content: "Welcome to Dendrien form" },
	];
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/");
	}

	if (_action === "next") {
		return redirect("/signup/basics");
	}
};

export default function Index() {
	return (
		<Container pageTitle="Sign up" nextEnabled={true}>
			<div className="flex flex-col justify-between">
				<div>
					<TextComponent
						text="Your responses to all our questions	are completely confidential. We will never share your name or any
						other identifying information with your employer (or anyone else),
						and all responses will be aggregated across all the people who take
						it before being reported in summary form to anyone."
					/>
					<br />
					<TextComponent text="To start, tell us a little about yourself…" />
				</div>
				<div>
					Already have an account?{" "}
					<Link className="text-blue-800 underline underline-offset-2" to="/">
						Login
					</Link>
				</div>
			</div>
		</Container>
	);
}
