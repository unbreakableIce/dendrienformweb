import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import OpenAI from "openai";
import { MouseEvent, useState } from "react";
import { Value } from "~/Data/types/module";
import Container2 from "~/components/layout/Container2";
import Spinner from "~/components/layout/Spinner";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import SuggestionComponent from "~/components/module3/SuggestionComponent";
import TextComponent from "~/components/shared/TextComponent";
import { savePurposeStatement } from "~/Data/queries/cosmos";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module3/intro3");
	}

	if (_action === "next") {
		const results = data.get("suggestion0") as string;
		const result = await redis.set(`m3p1#${user.user.userId}`, results);

		try{
			//TODO add edited field
			savePurposeStatement(user.user.userId, results, false);
		}
		catch (error) {
			console.log(error);
		}

		return redirect("/module/module3/page2");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const jsonval = await redis.get(`m1p3#${user.user.userId}`);
	const input = await redis.lrange(`m2p4#${user.user.userId}`, 0, -1);

	const oldStatement = await redis.get(`m3p1#${user.user.userId}`);

	if (jsonval === null || input.length === 0) {
		throw new Error("You have to pass module 1 and 2 to complete this module");
	}

	const allValues: Value[] = JSON.parse(jsonval);
	const values = allValues.filter((_, i) => i < 5);

	const valueString = values.map(val => val.label).join(", ");
	const inputString = input.join(", ");

	const promptInstruction = `Write a life purpose statement of 20-30 words using 2 to 3 common themes among the core values of ${valueString} and the personal identities of ${inputString}, but do not overtly mention these identities. Make the statement sound inspiring and positive, but keep the language simple.`;

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

	return json({ oldStatement, suggestion, promptInstruction });
};

export default function Page1Module3() {
	const { oldStatement, suggestion, promptInstruction } =
		useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const [key, setkey] = useState(0);

	if (oldStatement && !suggestion.includes(oldStatement)) {
		suggestion.unshift(oldStatement);
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
		<Container2 key={key} pageTitle="Why Am I Here?">
			<div>
				<TextComponent
					text="If you want to move an old purpose statement up to the top box to edit and/or accept it,
					 simply click on it."
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
