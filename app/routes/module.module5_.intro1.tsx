import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		return redirect("/module/module5/page1");
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

	const [s1, s2, s3, s4] = await Promise.all([
		redis.lrange(`m2p1#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p2#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p3#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p4#${user.user.userId}`, 0, -1),
	]);

	if (previous === "/module") {
		if (s4.length < 0) {
			return redirect("/module/module2/page5");
		}

		if (s3.length < 0) {
			return redirect("/module/module2/page4");
		}

		if (s2.length < 0) {
			return redirect("/module/module2/page3");
		}

		if (s1.length < 0) {
			return redirect("/module/module2/page2");
		}
	}

	return json({ user });
};

export default function Module5Form1() {
	return (
		<Container first={true} pageTitle="Introduction" nextEnabled={true}>
			<TextComponent
				text="On the following page, you’ll find the LifeSpaces you encountered in the previous step, along with their descriptions and your finalized LifeSpace Expression for each. Now it’s time to start working on your aspirations. Don’t worry; while many people find the question of “Who do you want to be?” to be daunting, we’ve tried to make this as easy as possible for you by breaking it down into specific questions relating to different aspects of each LifeSpace."
			/>
			<br />
			<TextComponent
				text="You don’t need to answer every question that we present within each LifeSpace; instead, just focus on the specific questions that interest you the most. Your aspirations reflect your own priorities, and you should not feel compelled to aspire to something in every possible area of your life. Having too many priorities really means that you have no priorities."
			/>

			<div className="flex-grow flex flex-col content-center gap-16 mx-auto w-2/3">
				<div className="flex flex-col gap-4 mx-auto justify-center pb-3">
					<h2 className="text-2xl font-bold">Click Next to continue.</h2>
				</div>
			</div>
		</Container>
	);
}
