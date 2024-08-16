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
		return redirect("/module/module5/prosperity/page1");
	}

	if (_action === "next") {
		await redis.set(`module5:relationships:user:${user.user.userId}`, results);
		return redirect("/module/module5/vocation/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.get(`module5:relationships:user:${user.user.userId}`) || "{}";
	let jsonRelationships = JSON.parse(values);

	return json({ user, jsonRelationships });
};

export default function Module5RelationshipsPage1() {
	const { user, jsonRelationships } = useLoaderData<typeof loader>();
	const [romanticPartner, setRomanticPartner] = useState(jsonRelationships.romanticPartner || "");
	const [closeFriends, setCloseFriends] = useState(jsonRelationships.closeFriends || "");
	const [acquaintances, setAcquaintances] = useState(jsonRelationships.acquaintances || "");
	const [immediateFamily, setImmediateFamily] = useState(jsonRelationships.immediateFamily || "");
	const [extendedFamily, setExtendedFamily] = useState(jsonRelationships.extendedFamily || "");


	return (
		<Container
			first={false}
			pageTitle="Relationships"
			nextEnabled={true}
			nextValue={JSON.stringify({ romanticPartner, closeFriends, acquaintances, immediateFamily, extendedFamily })}
		>
			<TextComponent
				text="The Relationships LifeSpace relates to your primary connections to others, including family, friends, romantic partners, and acquaintances. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you. Clicking 'Next' will save your answers and take you to the Vocations LifeSpace."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel pt={4}>Romantic partner(s): What qualities do you value in a romantic partner, and what kind of relationship do you aspire to have? If you already have a partner, how can you help them pursue what’s important to them and deepen your relationship?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="romanticPartner"
						value={romanticPartner}
						onChange={(e) => setRomanticPartner(e.target.value)}
					/>
					<FormLabel pt={4}>Close friends: What kind of support and qualities do you seek in your close friendships? In what ways do you want to be a better friend to others?
					</FormLabel>
					<Textarea
						name="closeFriends"
						placeholder='Max 250 words'
						value={closeFriends}
						onChange={(e) => setCloseFriends(e.target.value)}
					/>
					<FormLabel pt={4}>Acquaintances: How would you like to expand your network of acquaintances, and what value do you hope to gain from these connections?
					</FormLabel>
					<Textarea
						name="acquaintances"
						placeholder='Max 250 words'
						value={acquaintances}
						onChange={(e) => setAcquaintances(e.target.value)}
					/>
					<FormLabel pt={4}>Immediate family: What are your goals for your immediate family relationships, and how do you plan to strengthen them?
					</FormLabel>
					<Textarea
						name="immediateFamily"
						placeholder='Max 250 words'
						value={immediateFamily}
						onChange={(e) => setImmediateFamily(e.target.value)}
					/>
					<FormLabel pt={4}>Extended family: How do you wish to engage with your extended family, and what role do you see them playing in your life?
					</FormLabel>
					<Textarea marginBottom={4}
						name="extendedFamily"
						placeholder='Max 250 words'
						value={extendedFamily}
						onChange={(e) => setExtendedFamily(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
