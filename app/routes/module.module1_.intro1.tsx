import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { FormModule } from "~/Data/types/module";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import { getModule } from "~/utils/data";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		return redirect("/module/module1/page1");
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

	const [s1, s2, s3] = await Promise.all([
		redis.get(`m1p1#${user.user.userId}`),
		redis.get(`m1p2#${user.user.userId}`),
		redis.get(`m1p3#${user.user.userId}`),
	]);

	if (previous === "/module") {
		if (s3) {
			return redirect("/module/module1/page4");
		}

		if (s2) {
			return redirect("/module/module1/page3");
		}

		if (s1) {
			return redirect("/module/module1/page2");
		}
	}

	const module: FormModule = getModule();

	return json({ module });
};

export default function ModuleForm() {
	const { module } = useLoaderData<typeof loader>();

	return (
		<Container first={true} pageTitle={module.moduleName} nextEnabled={true}>
			<TextComponent
				text="Exploring your core values can be an extremely useful activity and is
				something that you can do on a regular basis. As you grow and change,
				your values can grow and change with you!"
			/>

			<TextComponent
				text="People's values represent their priorities in life, and priorities can shift over time and circumstances.
				 Consequently, when you consider your highest values at work,
				 your list might be a little different than it would be if you were considering your highest values outside of work."
			/>
			<br />

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
					<h2 className="text-2xl font-bold">Click Next to continue.</h2>
				</div>
			</div>

		</Container>
	);
}
