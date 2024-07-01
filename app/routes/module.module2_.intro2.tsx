import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import Container from "~/components/layout/Container";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module2/intro1");
	}

	if (_action === "next") {
		return redirect("/module/module2/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};

export default function Module2Form1() {
	return (
		<Container pageTitle="Who Am I?" nextEnabled={true}>
			<div className="flex-grow flex flex-col content-center gap-16 mx-auto w-2/3">
				<p className="text-xl">
					On the next few pages, in each box (next to "I am...") type in a word or short phrase that captures who you believe yourself to be. We will ask
					you to do this three separate times, first capturing your
					strongest traits, then capturing your primary activities,
					and finally your roles and relationships.
				</p>
				<div className="flex flex-col gap-4 mx-auto justify-center">
					<h2 className="text-2xl font-bold">Let's begin.</h2>
				</div>
			</div>
		</Container>
	);
}
