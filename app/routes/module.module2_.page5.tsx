import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Container2 from "~/components/layout/Container2";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import TextComponent from "~/components/shared/TextComponent";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action } = Object.fromEntries(formData);

	if (_action === "startOver") {
		return redirect("/module/module2/intro1");
	}

	if (_action === "back") {
		return redirect("/module/module2/page4");
	}

	if (_action === "next") {
		return redirect("/module/module2/page6");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.lrange(`m2p4#${user.user.userId}`, 0, -1);

	if (values.length === 0) {
		return redirect("/module2/page1");
	}

	return json({ values, user });
};

export default function FifthModule5() {
	const { values, user } = useLoaderData<typeof loader>();

	const inputList = values.map((v, i) => (
		<div className="flex flex-wrap content-center border-2 border-gray-800 px-6 py-4 gap-4 rounded-lg w-full ">
			<span className="w-full text-center">{v}</span>
		</div>
	));

	return (
		<Container2 pageTitle={`${user.user.firstname}'s Core Characteristics`}>
			<div className="w-full h-full relative">
				<div className="flex flex-col gap-6 px-8 justify-start">
					<h3 className="text-2xl text-center">
						Here are the five core characteristics that you selected.
					</h3>
					<TextComponent
						text="Please review the core characteristics below.
					 If you are satisfied that these reflect your most important characteristics, then click the 'Next' button to accept them and go on to the next module.
					  Otherwise, click 'Back' to change your core characteristics."
					/>

					<div className="grid grid-cols-1 gap-y-2 mx-auto justify-items-start w-full max-w-[450px]">
						{inputList}
					</div>
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
