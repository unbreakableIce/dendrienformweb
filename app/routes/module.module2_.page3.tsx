import {
	ActionFunctionArgs,
	redirect,
	json,
	LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import Container2 from "~/components/layout/Container2";
import FormComponent from "~/components/module2/FormComponent";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action, ...values } = Object.fromEntries(formData);
	const errors: Record<string, string> = {};

	if (_action === "back") {
		return redirect("/module/module2/page2");
	}

	if (_action === "next") {
		const valueList = Object.values(values).filter((x) => x !== "") as string[];

		if (valueList.length < 3) {
			errors.limit = "Please fill out at least 3";
			return json({ errors });
		}

		await redis.del(`m2p3#${user.user.userId}`);
		await redis.lpush(`m2p3#${user.user.userId}`, ...valueList);
		return redirect("/module/module2/page4");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = (
		await redis.lrange(`m2p3#${user.user.userId}`, 0, -1)
	).reverse();
	return json({ data, user });
};

export default function ThirdModule2() {
	const err = useActionData<typeof action>();
	const { data, user } = useLoaderData<typeof loader>();

	return (
		<Container2 pageTitle={`${user.user.firstname}'s Roles & Relationships`}>
			<div className="flex flex-col justify-center gap-8 px-4">
				<TextComponent text="Let's do this exercise one last time, but now in the boxes below, finish each “I am…” statement by writing a word or brief phrase that reflects a social role or relationship you have that is especially important to who you are. For instance, you might write, “I am… a mom,” or “I am… a volunteer,” or “I am… a best friend.”" />
				<div className="flex flex-col gap-2">
					{err?.errors && (
						<p className="text-red-500 text-center text-lg">
							{err.errors.limit}
						</p>
					)}
					<h4 className="text-xl">
						Take a moment to write up to five  words or short phrases in the
						boxes below.
					</h4>
					<i>(but try to write at least three if you can)</i>
					<FormComponent data={data} formName="valuesForm" />
				</div>
			</div>
		</Container2>
	);
}
