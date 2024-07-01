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
		return redirect("/module/module2/page1");
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
		if (s4.length > 0) {
			return redirect("/module/module2/page5");
		}

		if (s3.length > 0) {
			return redirect("/module/module2/page4");
		}

		if (s2.length > 0) {
			return redirect("/module/module2/page3");
		}

		if (s1.length > 0) {
			return redirect("/module/module2/page2");
		}
	}

	return json({ user });
};

export default function Module2Form1() {
	return (
		<Container first={true} pageTitle="Who Am I?" nextEnabled={true}>
			<TextComponent
				text="This next exercise is designed to help you explore the most important
					ways you define and describe yourself, which we will simply call your
					identities. Just as with the values exercise, there are no right or
					wrong answers here. How you define yourself is up to you, and no one
					can tell you who you are or who you should be. That's for you to
					determine."
			/>
			<br />
			<TextComponent
				text="This is a simple exercise on the face of it, but people sometimes find
					it challenging, nonetheless. So, don't worry if you find it difficult.
					You are in good company!"
			/>

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
