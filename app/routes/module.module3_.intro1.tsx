import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const { _action } = Object.fromEntries(formData);

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		return redirect("/module/module3/intro2");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const previous = request.headers
		.get("referer")
		?.split(request.headers.get("host") || "")
		.at(-1);

	const s1 = await redis.get(`m3p1#${user.user.userId}`);

	if (previous === "/module" ) {
		if (s1) {
			return redirect("/module/module3/page1");
		}
	}

	return user;
};

export default function Intro2Module3() {
	return (
		<Container first={true} pageTitle="Why Am I Here?" nextEnabled={true}>
			<TextComponent
				text="Having a written purpose statement is a good way to focus your
				life's pursuits and evaluate paths that present themselves to you.
				A good purpose statement should align with your top values and reflect
				who you are and who you want to be. In other words, a purpose statement
				should combine realism with idealism, reflecting what is true today and
				what you wish to be true in the future."
			/>
		</Container>
	);
}
