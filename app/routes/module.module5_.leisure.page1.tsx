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


export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action, ...values } = Object.fromEntries(formData);
	const errors: Record<string, string> = {};
	const results = formData.get("results") as string;

	if (_action === "back" || _action === "home") {
		//await redis.set(`module5:leisure:user:${user.user.userId}`, results);
		return redirect("/module/module5/community/page1");
	}

	if (_action === "next") {
		await redis.set(`module5:leisure:user:${user.user.userId}`, results);
		return redirect("/module/module5/prosperity/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.get(`module5:leisure:user:${user.user.userId}`) || "{}";
	let jsonLeisure = JSON.parse(values);

	return json({ user, jsonLeisure });
};

export default function Module5LeisurePage1() {

	const { user, jsonLeisure } = useLoaderData<typeof loader>();
	const [curiosities, setCuriosities] = useState(jsonLeisure.curiosities || "");
	const [hobbies, setHobbies] = useState(jsonLeisure.hobbies || "");
	const [socialActivities, setSocialActivities] = useState(jsonLeisure.socialActivities || "");
	const [sports, setSports] = useState(jsonLeisure.sports || "");
	const [travel, setTravel] = useState(jsonLeisure.travel || "");

	return (
		<Container
			first={false}
			pageTitle="Leisure"
			nextEnabled={true}
			nextValue={JSON.stringify({ curiosities, hobbies, socialActivities, sports, travel })}
		>
			<TextComponent
				text="The Leisure LifeSpace relates to what you do for fun and relaxation, as well as more focused or organized activities that you do to enrich your personal life. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you. Clicking 'Next' will save your answers take you to the Prosperity LifeSpace."
			/>
			<br />
			<Form method="post" id="valuesForm">
				<FormControl>
					<FormLabel pt={4}>Curiosities: What new interests would you like to explore in your free time?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="curiosities"
						value={curiosities}
						onChange={(e) => setCuriosities(e.target.value)}
					/>
					<FormLabel pt={4}>What hobbies are you interested in pursuing more deeply, and what skills do you hope to develop?
					</FormLabel>
					<Textarea
						name="hobbies"
						placeholder='Max 250 words'
						value={hobbies}
						onChange={(e) => setHobbies(e.target.value)}
					/>
					<FormLabel pt={4}>Social activities: What types of social activities do you want to engage in more, and why
					</FormLabel>
					<Textarea
						name="socialActivities"
						placeholder='Max 250 words'
						value={socialActivities}
						onChange={(e) => setSocialActivities(e.target.value)}
					/>
					<FormLabel pt={4}>Sports: Are there any sports you'd like to take up or get better in, and what draws you to them?
					</FormLabel>
					<Textarea
						name="sports"
						placeholder='Max 250 words'
						value={sports}
						onChange={(e) => setSports(e.target.value)}
					/>
					<FormLabel pt={4}>Travel: What travel destinations are on your bucket list, and what do you hope to experience there?
					</FormLabel>
					<Textarea marginBottom={4}
						name="travel"
						placeholder='Max 250 words'
						value={travel}
						onChange={(e) => setTravel(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
