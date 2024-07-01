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
		return redirect("/module/module4/intro4");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};

export default function Intro3Module4() {
	return (
		<Container pageTitle="Purpose in Each Part of My Life" nextEnabled={true}>
			<TextComponent
				text="Write a unique expression of your overarching purpose statement for each
				of these LifeSpaces, either on your own or with the assistance of a
				large language model, such as ChatGPT (then editing the output to fit
				your preferences)."
			/>
			<p className="mt-8 flex flex-col gap-4">
				<h3 className="font-semibold text-xl">
					A reminder about crafting a strong LifeSpace Expression of your
					purpose:
				</h3>
				<ol>
					<li>
						<TextComponent
							text="Use positive action words that reflect what you want (to be, do,
						achieve, experience) rather than what you don't want."
						/>
					</li>
					<li>
						<TextComponent
							text="Use the present tense, even though your statement reflects desired
						states that are not fully realized yet."
						/>
					</li>
					<li>
						<TextComponent
							text="Let yourself revise your statement as much as you want to until it
						feels right."
						/>
					</li>
				</ol>
			</p>
		</Container>
	);
}
