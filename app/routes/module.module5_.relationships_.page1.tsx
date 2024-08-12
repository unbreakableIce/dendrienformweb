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
		await redis.set(`module5:relationships:user:${user.user.userId}`, JSON.stringify(values));

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

export default function Module5RelationshipsPage1() {

	return (
		<Container first={true} pageTitle="Relationships" nextEnabled={true}>
			<TextComponent
				text="The Relationships LifeSpace relates to your primary connections to others, including family, friends, romantic partners, and acquaintances. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel>Romantic partner(s): What qualities do you value in a romantic partner, and what kind of relationship do you aspire to have? If you already have a partner, how can you help them pursue what’s important to them and deepen your relationship?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="romanticPartner"
					/>
					<FormLabel>Close friends: What kind of support and qualities do you seek in your close friendships? In what ways do you want to be a better friend to others?
					</FormLabel>
					<Textarea
						name="closeFriends"
						placeholder='Max 250 words'
					/>
					<FormLabel>Acquaintances: How would you like to expand your network of acquaintances, and what value do you hope to gain from these connections?
					</FormLabel>
					<Textarea
						name="acquaintances"
						placeholder='Max 250 words'
					/>
					<FormLabel>Immediate family: What are your goals for your immediate family relationships, and how do you plan to strengthen them?
					</FormLabel>
					<Textarea
						name="immediateFamily"
						placeholder='Max 250 words' />
					<FormLabel>Extended family: How do you wish to engage with your extended family, and what role do you see them playing in your life?
					</FormLabel>
					<Textarea
						name="extendedFamily"
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
