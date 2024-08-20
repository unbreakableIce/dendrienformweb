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
		return redirect("/module/module3/intro2");
	}

	if (_action === "next") {
		return redirect("/module/module3/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};

export default function Intro4Module3() {
	return (
		<Container pageTitle="Why Am I Here?" nextEnabled={true}>
			<div className="mb-4">
			<TextComponent
				text="On the next page is a draft purpose statement.
				You can edit it, rewrite it entirely, or ask us to regenerate a new one for you.
				If you ask us to regenerate it, the old statement will move down the page so you can still see it (in case there was anything you liked about it that you want to keep).
				You can ask us to generate up to a total of five purpose statements.
				 Once you are satisfied with your purpose statement, click ‘Accept.’"
			/>
			</div>
		</Container>
	);
}
