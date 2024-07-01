import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const { _action } = Object.fromEntries(formData);

	if (_action === "back") {
		return redirect("/module/module4/intro2");
	}

	if (_action === "next") {
		return redirect("/module/module4/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};

export default function Intro4Module4() {
	return (
		<Container pageTitle="Purpose in Each Part of My Life" nextEnabled={true}>
			<div className="flex flex-col gap-4">
				<TextComponent
					text="Note: If you want to use a large language model, such as ChatGPT, to get
				you started, that's great! Using such tools can be a fantastic way
				to generate the LifeSpace Expressions of your purpose statement that you
				can edit until it works well for you."
				/>
				<TextComponent
					text="Based on our own research using such models, we suggest you use
				something like the following as your prompt, referring ChatGPT
				specifically to your previously composed purpose statement:"
				/>
			</div>
		</Container>
	);
}
