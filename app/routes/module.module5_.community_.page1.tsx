import { FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";


export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action, ...values } = Object.fromEntries(formData);
	const errors: Record<string, string> = {};
	const results = formData.get("results") as string;

	if (_action === "back" || _action === "home") {
		await redis.set(`module5:community:user:${user.user.userId}`, results);
		return redirect("/module");
	}

	if (_action === "next") {
		await redis.set(`module5:community:user:${user.user.userId}`, results);
		return redirect("/module/module5/leisure/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.get(`module5:community:user:${user.user.userId}`) || "{}";
	const jsonCommunity = JSON.parse(values);
	return json({ user, jsonCommunity });
};

export default function Module5CommunityPage1() {

	const { user, jsonCommunity } = useLoaderData<typeof loader>();
	const [builtEnvironment, setBuiltEnvironment] = useState(jsonCommunity.builtEnvironment || "");
	const [civicOrganizations, setCivicOrganizations] = useState(jsonCommunity.civicOrganizations || "");
	const [government, setGovernment] = useState(jsonCommunity.government || "");
	const [causes, setCauses] = useState(jsonCommunity.causes || "");
	const [naturalEnvironment, setNaturalEnvironment] = useState(jsonCommunity.naturalEnvironment || "");

	return (
		<Container
			first={false}
			pageTitle="Community"
			nextEnabled={true}
			nextValue={JSON.stringify({ builtEnvironment, civicOrganizations, government, causes, naturalEnvironment })}
		>
			<TextComponent
				text="The Community LifeSpace concerns how you relate to the place you live and the systems that make it run, such as the physical and natural environment, civic organizations, government, and volunteer or charitable activities. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you."
			/>
			<br />
			<Form method="post" id="valuesForm">
				<FormControl >
					<FormLabel pt={4}>Built environment: What improvements would you like to see in your local infrastructure and public spaces to enhance community life?
					</FormLabel>
					<Textarea form="valuesForm"
						placeholder='Max 250 words'
						name="builtEnvironment"
						value={builtEnvironment}
						onChange={(e) => setBuiltEnvironment(e.target.value)}
					/>
					<FormLabel pt={4}>Civic organizations and charities: Which types of civic organizations or charities would you like to be more involved with, and what impact do you hope to achieve through them?</FormLabel>
					<Textarea
						name="civicOrganizations"
						placeholder='Max 250 words'
						value={civicOrganizations}
						onChange={(e) => setCivicOrganizations(e.target.value)} />
					<FormLabel pt={4}> Government: What changes or initiatives would you like to see in government that could better serve your community?</FormLabel>
					<Textarea
						name="government"
						placeholder='Max 250 words'
						value={government}
						onChange={(e) => setGovernment(e.target.value)}
					/>
					<FormLabel pt={4}>Causes: What social or environmental causes are you passionate about, and how would you like to contribute to them?</FormLabel>
					<Textarea
						name="causes"
						placeholder='Max 250 words'
						value={causes}
						onChange={(e) => setCauses(e.target.value)}
					/>
					<FormLabel pt={4}>Natural environment: How would you like to see the natural environment in your community better preserved or enhanced?</FormLabel>
					<Textarea marginBottom={4}
						name="naturalEnvironment"
						placeholder='Max 250 words'
						value={naturalEnvironment}
						onChange={(e) => setNaturalEnvironment(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
