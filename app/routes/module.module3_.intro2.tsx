import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Value } from "~/Data/types/module";
import { ClickedValue } from "~/Data/types/pagemeta";
import Container from "~/components/layout/Container";
import FormComponent from "~/components/module2/FormComponent";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();

	const { _action } = Object.fromEntries(formData);

	if (_action === "back") {
		return redirect("/module/module3/intro1");
	}

	if (_action === "next") {
		return redirect("/module/module3/intro3");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const jsonval = await redis.get(`m1p3#${user.user.userId}`);
	const input = await redis.lrange(`m2p4#${user.user.userId}`, 0, -1);

	if (jsonval === null || input.length === 0) {
		throw new Error("You have to pass module 1 and 2 to complete this module");
	}

	// TODO: take also the values of the module 2
	const clickedValues: ClickedValue[] = JSON.parse(jsonval);
	const values = clickedValues.filter((x) => x.isSelected).map((x) => x.value);

	return json({ values, input, user });
};

export default function Intro3Module3() {
	const { values, input, user } = useLoaderData<typeof loader>();

	return (
		<Container pageTitle="Why Am I Here?" nextEnabled={true}>
			<div className="flex flex-col justify-center gap-8 px-4 mb-4">
				<TextComponent
					text="In a moment, we will generate a draft purpose statement for you,
					using all the information you have provided so far about your root values and core characteristics. "
				/>
				<TextComponent
					text="On the next page, you will see three versions of your life purpose statement. Clicking on one will move it to the top box, where you can edit it and accept the edited version, or even replace it entirely with your own version if you would like (and then accept that version). Before you go to the purpose statements page, take a moment to review your root values and core characteristics below."
				/>
				<div className="grid grid-cols-2 gap-x-4">
					<div className="flex flex-col gap-2">
						<h4 className="text-xl">{user.user.firstname}'s Root Values</h4>
						<FormComponent
							data={values.map((x) => x.label)}
							formName="valuesForm"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<h4 className="text-xl">
							{user.user.firstname}'s Core Characteristics
						</h4>
						<FormComponent data={input} formName="valuesForm" />
					</div>
				</div>
			</div>
		</Container>
	);
}
