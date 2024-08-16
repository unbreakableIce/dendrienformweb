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
		return redirect("/module/module5/leisure/page1");
	}

	if (_action === "next") {
		await redis.set(`module5:prosperity:user:${user.user.userId}`, results);
		return redirect("/module/module5/relationships/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const values = await redis.get(`module5:prosperity:user:${user.user.userId}`) || "{}";
	let jsonProsperity = JSON.parse(values);

	return json({ user, jsonProsperity });
};

export default function Module5ProsperityPage1() {
	const { user, jsonProsperity } = useLoaderData<typeof loader>();
	const [income, setIncome] = useState(jsonProsperity.income || "");
	const [materialPossessions, setMaterialPossessions] = useState(jsonProsperity.materialPossessions || "");
	const [financialRisk, setFinancialRisk] = useState(jsonProsperity.financialRisk || "");
	const [wealth, setWealth] = useState(jsonProsperity.wealth || "");
	const [debt, setDebt] = useState(jsonProsperity.debt || "");


	return (
		<Container
			first={false}
			pageTitle="Prosperity"
			nextEnabled={true}
			nextValue={JSON.stringify({ income, materialPossessions, financialRisk, wealth, debt })}
		>
			<TextComponent
				text="The Prosperity LifeSpace relates to your current finances and your financial goals, as well as other material accumulations.Read each of the descriptions and questions below, and answer the ones that you feel apply the most to you. You may answer none, some or all of these questions, as it suits you. Clicking 'Next' will save your answers and take you to the Relationships LifeSpace."
			/>
			<br />
			<Form method="post" id="valuesForm">

				<FormControl>
					<FormLabel pt={4}>Income: What is your ideal income level, and how might you achieve it?
					</FormLabel>
					<Textarea
						placeholder='Max 250 words'
						name="income"
						value={income}
						onChange={(e) => setIncome(e.target.value)}
					/>
					<FormLabel pt={4}>Material possessions: What material possessions are important to you to pursue, and how might they contribute to your happiness or connect to your values?
					</FormLabel>
					<Textarea
						name="materialPossessions"
						placeholder='Max 250 words'
						value={materialPossessions}
						onChange={(e) => setMaterialPossessions(e.target.value)}
					/>
					<FormLabel pt={4}>Financial risk: How do you feel about taking financial risks, and what types of investments or ventures are you interested in?
					</FormLabel>
					<Textarea
						name="financialRisk"
						placeholder='Max 250 words'
						value={financialRisk}
						onChange={(e) => setFinancialRisk(e.target.value)}
					/>
					<FormLabel pt={4}>Wealth: What is your definition of wealth, and what steps are you taking to achieve it?
					</FormLabel>
					<Textarea
						name="wealth"
						placeholder='Max 250 words'
						value={wealth}
						onChange={(e) => setWealth(e.target.value)}
					/>
					<FormLabel pt={4}>Debt: How do you plan to manage or eliminate debt, and what strategies do you need to use to stay or become financially healthy?
					</FormLabel>
					<Textarea marginBottom={4}
						name="debt"
						placeholder='Max 250 words'
						value={debt}
						onChange={(e) => setDebt(e.target.value)}
					/>
				</FormControl>
			</Form>

		</Container>
	);
}
