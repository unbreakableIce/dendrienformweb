import {
	ActionFunctionArgs,
	redirect,
	json,
	LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useActionData, useNavigation } from "@remix-run/react";
import OpenAI from "openai";
import { useState, MouseEvent } from "react";
import Container2 from "~/components/layout/Container2";
import Spinner from "~/components/layout/Spinner";
import SuggestionComponent from "~/components/module3/SuggestionComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import TextComponent from "~/components/shared/TextComponent";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();

	const { _action, ...values } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module4/page5");
	}

	if (_action === "next") {
		const results = data.get("suggestion0") as string;
		const result = await redis.set(`m4p6#${user.user.userId}`, results);
		return redirect("/module/module4/page7");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const statement = await redis.get(`m3p1#${user.user.userId}`);
	const oldstatement = await redis.get(`m4p6#${user.user.userId}`);

	const lifeSpace = "Wellbeing";
	const description =
		"All aspects of your health across the physical, mental, and spiritual dimensions of your life";

	/*
	const promptInstruction = `Consider this overarching life purpose statement: ${statement}.
	 Suggest ways that a person could express this holistic purpose within the ${lifeSpace} domain,
	 using no more than one sentence , given the definition of the domain is ${description}. Start with the statement`;
	*/
	const promptInstruction = `Using no more than one sentence, write a mini-purpose statement that
	 							reflects how a person could express
							 	their overarching life purpose within the domain of ${lifeSpace}.
								Write this mini-purpose statement in the form of a statement in the first-person,
								using active verbs and simple language. 
								This person’s life purpose is the following: ${statement}`;

	const suggestion = new Array<string>();

	const openai = new OpenAI();

	for (let i = 0; i < 5; i++) {
		const completion = await openai.chat.completions.create({
			messages: [{ role: "user", content: promptInstruction }],
			model: "gpt-3.5-turbo",
			stream: false,
		});

		suggestion.push(completion.choices[0].message.content!.replaceAll('"', ""));
	}

	return json({ oldstatement, suggestion, promptInstruction });
};

export default function Page6Module4() {
	const { oldstatement, suggestion, promptInstruction } =
		useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const [key, setkey] = useState(0);

	if (oldstatement && !suggestion.includes(oldstatement)) {
		suggestion.unshift(oldstatement);
	}

	const isSubmitting = navigation.formAction === "/module/module3/page1";

	const handleClick = (e: MouseEvent<HTMLTextAreaElement>, index: number) => {
		suggestion.splice(index, 1);
		suggestion.unshift(e.currentTarget.value);
		setkey(a => a + 1);
	};

	const textlist = suggestion.map((text, index, arr) => (
		<SuggestionComponent
			key={index}
			text={text}
			index={index}
			formName="valuesForm"
			handleClick={e => handleClick(e, index)}
		/>
	));

	return (
		<Container2 key={key} pageTitle="LifeSpace Expression for Wellbeing">
			<div>
				<TextComponent
					text="Accept, edit, or regenerate the LifeSpace Expression
				 of your purpose in the domain of Wellbeing."
				/>

				<div>
					{isSubmitting && <Spinner />}
					<input
						form="valuesForm"
						type="hidden"
						name="prompt"
						value={promptInstruction}
					/>
					{textlist}
				</div>
			</div>
		</Container2>
	);
}
