import { ArrowLongRightIcon, ForwardIcon } from "@heroicons/react/24/outline";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FormModule } from "~/Data/types/module";
import Container from "~/components/layout/Container";
import { authenticator } from "~/utils/auth.server";
import { getModule } from "~/utils/data";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module1/intro2");
	}

	if (_action === "next") {
		return redirect("/module/module1/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
	const module: FormModule = getModule();

	return json({ module });
};

export default function ModuleForm2() {
	const { module } = useLoaderData<typeof loader>();

	return (
		<Container pageTitle={module.moduleName} nextEnabled={true}>
			<div className="flex-grow flex flex-col content-center gap-16 mx-auto w-2/3">
				<p className="text-xl">
					The next exercise is designed to help you explore your highest values.
					If you want to do this exercise with your current workplace
					in mind, that&apos;s fine, but it is also fine if you don&apos;t. You
					can do this exercise with another context or no specific context in
					mind. It&apos;s completely up to you. They are <i>your</i> values, after all,
					and this exercise is meant to serve <i>your</i> needs.
				</p>
				<div className="flex flex-col gap-4 mx-auto justify-center">
					<h2 className="text-2xl font-bold">Let's begin.</h2>
				</div>
			</div>
		</Container>
	);
}
