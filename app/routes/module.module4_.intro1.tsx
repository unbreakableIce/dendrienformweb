import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const { _action } = Object.fromEntries(formData);

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		return redirect("/module/module4/intro2");
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

	const [s1, s2, s3, s4, s5, s6] = await Promise.all([
		redis.get(`m4p1#${user.user.userId}`),
		redis.get(`m4p2#${user.user.userId}`),
		redis.get(`m4p3#${user.user.userId}`),
		redis.get(`m4p4#${user.user.userId}`),
		redis.get(`m4p5#${user.user.userId}`),
		redis.get(`m4p6#${user.user.userId}`),
	]);

	if (previous === "/module" ) {
		if (s6) {
			return redirect("/module/module4/page7");
		}

		if (s5) {
			return redirect("/module/module4/page6");
		}

		if (s4) {
			return redirect("/module/module4/page5");
		}

		if (s3) {
			return redirect("/module/module4/page4");
		}

		if (s2) {
			return redirect("/module/module4/page3");
		}

		if (s1) {
			return redirect("/module/module4/page2");
		}
	}

	return user;
};

export default function Intro1Module4() {
	return (
		<Container
			first={true}
			pageTitle="Purpose in Each Part of My Life"
			nextEnabled={true}
		>
			<TextComponent
				text="Having a thoughtfully articulated purpose statement can transform your life, as it enables you to create aspirations that are a perfect fit for the person you want to become,
				to do what you believe you are here to do. "
			/>
			<br />
			<TextComponent
				text="It can also be helpful to
				express your overarching purpose in unique ways within the various spaces of your life. That's what we'll do next."
			/>
		</Container>
	);
}
