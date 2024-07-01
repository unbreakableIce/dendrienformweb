import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Container2 from "~/components/layout/Container2";
import SummaryComponent from "~/components/shared/SummaryComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();

	const { _action, ...values } = Object.fromEntries(data);

	if (_action === "startOver") {
		return redirect("/module/module4/intro1");
	}

	if (_action === "back") {
		return redirect("/module/module4/page6");
	}

	if (_action === "next") {
		return redirect("/module/module4/page8");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const [value1, value2, value3, value4, value5, value6] = await Promise.all([
		redis.get(`m4p1#${user.user.userId}`),
		redis.get(`m4p2#${user.user.userId}`),
		redis.get(`m4p3#${user.user.userId}`),
		redis.get(`m4p4#${user.user.userId}`),
		redis.get(`m4p5#${user.user.userId}`),
		redis.get(`m4p6#${user.user.userId}`),
	]);

	return json({ value1, value2, value3, value4, value5, value6 });
};

export default function Summary() {
	const { value1, value2, value3, value4, value5, value6 } =
		useLoaderData<typeof loader>();

	return (
		<Container2 pageTitle="Your Purpose Expressed Across Your LifeSpaces">
			<div className="w-full h-full relative">

				<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-12 items-stretch">

					<SummaryComponent
						title="LifeSpace Expression for Community"
						text={value1!}
					/>
					<SummaryComponent
						title="LifeSpace Expression for Leisure"
						text={value2!}
					/>
					<SummaryComponent
						title="LifeSpace Expression for Prosperity"
						text={value3!}
					/>
					<SummaryComponent
						title="LifeSpace Expression for Relationships"
						text={value4!}
					/>
					<SummaryComponent
						title="LifeSpace Expression for Vocation"
						text={value5!}
					/>
					<SummaryComponent
						title="LifeSpace Expression for Wellbeing"
						text={value6!}
					/>
				</div>
				<Form method="post" className="absolute bottom-0 left-0">
					<button
						name="_action"
						value="startOver"
						className="px-4 py-2 border-2 border-black rounded-xl hover:bg-[#b8c1b6]"
					>
						Start Over
					</button>
				</Form>
			</div>
		</Container2>
	);
}
