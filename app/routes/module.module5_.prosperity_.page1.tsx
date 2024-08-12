import { FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import Container from "~/components/layout/Container";
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

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		await redis.set(`module5:prosperity:user:${user.user.userId}`, JSON.stringify(values));

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

export default function Module5ProsperityPage1() {

	return (
		<Container first={true} pageTitle="Prosperity" nextEnabled={true}>
			<TextComponent
				text="The Prosperity LifeSpace relates to your current finances and your financial goals, as well as other material accumulations.Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel>Income: What is your ideal income level, and how might you achieve it?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="income"
					/>
					<FormLabel>Material possessions: What material possessions are important to you to pursue, and how might they contribute to your happiness or connect to your values?
					</FormLabel>
					<Textarea
						name="materialPossessions"
						placeholder='Max 250 words'
					/>
					<FormLabel>Financial risk: How do you feel about taking financial risks, and what types of investments or ventures are you interested in?
					</FormLabel>
					<Textarea
						name="financialRisk"
						placeholder='Max 250 words'
					/>
					<FormLabel>Wealth: What is your definition of wealth, and what steps are you taking to achieve it?
					</FormLabel>
					<Textarea
						name="wealth"
						placeholder='Max 250 words' />
					<FormLabel>Debt: How do you plan to manage or eliminate debt, and what strategies do you need to use to stay or become financially healthy?
					</FormLabel>
					<Textarea
						name="debt"
						placeholder='Max 250 words' />
				</FormControl>
				<button
					name="_action"
					value="next"
					type="submit"
					className={`px-8 py-2 flex flex-wrap justify-start content-cente gap-4 rounded-3xl text-gray-800 text-2xl font-bold capitalize hover:text-white group`}
				>
					<span className="hidden sm:inline  text-lg">Save</span>
					<ChevronRightIcon className="h-6 mt-1 group-hover:translate-x-6 transition ease-in-out duration-200" />
				</button>
			</Form>

		</Container>
	);
}
