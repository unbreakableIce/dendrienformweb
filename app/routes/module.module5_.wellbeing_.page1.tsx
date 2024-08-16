import { FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

//{"mental":"working out","physical":"run 3 miles a session 2x a week","spiritual":"keep praying","reputational":"strong , genuine","vitality":""}

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action, ...values } = Object.fromEntries(formData);
	const errors: Record<string, string> = {};
	const results = formData.get("results") as string;

	if (_action === "back" || _action === "home") {
		return redirect("/module/module5/vocation/page1");
	}

	if (_action === "next") {
		await redis.set(`module5:wellbeing:user:${user.user.userId}`, results);
		return redirect("/module/module5/finish");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.get(`module5:wellbeing:user:${user.user.userId}`) || "{}";
	let jsonWellbeing = JSON.parse(values);

	return json({ user, jsonWellbeing });
};

export default function Module5WellbeingPage1() {
	const { user, jsonWellbeing } = useLoaderData<typeof loader>();
	const [mental, setMental] = useState(jsonWellbeing.mental || "");
	const [physical, setPhysical] = useState(jsonWellbeing.physical || "");
	const [spiritual, setSpiritual] = useState(jsonWellbeing.spiritual || "");
	const [reputational, setReputational] = useState(jsonWellbeing.reputational || "");
	const [vitality, setVitality] = useState(jsonWellbeing.vitality || "");


	return (
		<Container
			first={false}
			pageTitle="Wellbeing"
			nextEnabled={true}
			nextValue={JSON.stringify({ mental, physical, spiritual, reputational, vitality })}
		>
			<TextComponent
				text="The Wellbeing LifeSpace relates to all aspects of your health across the physical, mental, and spiritual dimensions of your life. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you.  Click the 'Next' button to save your answers and move on to the Community LifeSpace."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel pt={4}>Mental: What practices do you need to incorporate in your life to maintain or improve your mental health?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="mental"
						value={mental}
						onChange={(e) => setMental(e.target.value)}
					/>
					<FormLabel pt={4}>Physical: What are your fitness and health goals, and how do you plan to achieve them?
					</FormLabel>
					<Textarea
						name="physical"
						placeholder='Max 250 words'
						value={physical}
						onChange={(e) => setPhysical(e.target.value)}
					/>
					<FormLabel pt={4}>Spiritual: How do you want to cultivate your spiritual wellbeing, and what practices are important to you?
					</FormLabel>
					<Textarea
						name="spiritual"
						placeholder='Max 250 words'
						value={spiritual}
						onChange={(e) => setSpiritual(e.target.value)}
					/>
					<FormLabel pt={4}>Reputational: How do you want to be perceived by others, and what actions are you taking to build your reputation?
					</FormLabel>
					<Textarea
						name="reputational"
						placeholder='Max 250 words'
						value={reputational}
						onChange={(e) => setReputational(e.target.value)}
					/>
					<FormLabel pt={4}>Vitality: What activities or habits do you need to engage in to maintain your energy and vitality?
					</FormLabel>
					<Textarea marginBottom={4}
						name="vitality"
						placeholder='Max 250 words'
						value={vitality}
						onChange={(e) => setVitality(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
