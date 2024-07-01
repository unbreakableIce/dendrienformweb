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
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import { getModule } from "~/utils/data";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module1/intro1");
	}

	if (_action === "next") {
		return redirect("/module/module1/intro3");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
	const module: FormModule = getModule();

	return json({ module });
};

export default function ModuleForm1() {
	const { module } = useLoaderData<typeof loader>();

	return (
		<Container pageTitle={module.moduleName} nextEnabled={true}>
			<TextComponent
				text="People's values represent their priorities in life, and priorities can shift over time and circumstances.
				 Consequently, when you consider your highest values at work,
				 your list might be a little different than it would be if you were considering your highest values outside of work."
			/>
			<br />
		</Container>
	);
}
