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
		return redirect("/module/module5/relationships/page1");
	}

	if (_action === "next") {
		await redis.set(`module5:vocation:user:${user.user.userId}`, results);
		return redirect("/module/module5/wellbeing/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
	const values = await redis.get(`module5:vocation:user:${user.user.userId}`) || "{}";
	let jsonVocation = JSON.parse(values);

	return json({ user, jsonVocation });
};

export default function Module5VocationPage1() {

	const { user, jsonVocation } = useLoaderData<typeof loader>();
	const [achievements, setAchievements] = useState(jsonVocation.achievements || "");
	const [awards, setAwards] = useState(jsonVocation.awards || "");
	const [credentials, setCredentials] = useState(jsonVocation.credentials || "");
	const [competencies, setCompetencies] = useState(jsonVocation.competencies || "");
	const [vocationalNetwork, setVocationalNetwork] = useState(jsonVocation.vocationalNetwork || "");

	return (
		<Container
			first={false}
			pageTitle="Vocation"
			nextEnabled={true}
			nextValue={JSON.stringify({ achievements, awards, credentials, competencies, vocationalNetwork })}
		>
			<TextComponent
				text="The Vocation LifeSpace relates to the primary role through which you apply yourself, such as a paid job, being a caretaker, or being a student. Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you. Click the 'Next' button to save your answers and move on to the Wellbeing LifeSpace."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel pt={4}>Achievements: What professional achievements are you aiming for, and how do you plan to reach them?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="achievements"
						value={achievements}
						onChange={(e) => setAchievements(e.target.value)}

					/>
					<FormLabel pt={4} >Awards: Are there specific awards or recognitions you aspire to receive in your career, and what steps can you take to earn them?
					</FormLabel>
					<Textarea
						name="awards"
						placeholder='Max 250 words'
						value={awards}
						onChange={(e) => setAwards(e.target.value)}
					/>
					<FormLabel pt={4}>Credentials: What credentials or qualifications do you want to obtain to advance in your career?
					</FormLabel>
					<Textarea
						name="credentials"
						placeholder='Max 250 words'
						value={credentials}
						onChange={(e) => setCredentials(e.target.value)}
					/>
					<FormLabel pt={4}>Competencies: What abilities do you wish to develop to enhance your professional capacity?
					</FormLabel>
					<Textarea
						name="competencies"
						placeholder='Max 250 words'
						value={competencies}
						onChange={(e) => setCompetencies(e.target.value)}
					/>
					<FormLabel pt={4}>Vocational network: How do you plan to build and leverage your professional network to support your career goals?
					</FormLabel>
					<Textarea marginBottom={4}
						name="vocationalNetwork"
						placeholder='Max 250 words'
						value={vocationalNetwork}
						onChange={(e) => setVocationalNetwork(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
