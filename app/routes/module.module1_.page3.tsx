import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MouseEvent, useState } from "react";
import { FormModule } from "~/Data/types/module";
import { ClickedValue } from "~/Data/types/pagemeta";
import { getModule } from "~/utils/data";
import redis from "~/utils/connection";
import Container from "~/components/layout/Container";
import Button from "~/components/shared/Button";
import { authenticator } from "~/utils/auth.server";
import TextComponent from "~/components/shared/TextComponent";
import { compareValuesArray } from "~/utils/utilsFunc";
import { clearLifePurpose, clearPurposeStatement } from "~/utils/redisUtils";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module1/page2");
	}

	if (_action === "next") {
		// Compare the old array values and the new values
		// If they're different, just delete the purpose statements
		const oldArray: ClickedValue[] = JSON.parse(
			(await redis.get(`m1p3#${user.user.userId}`)) || "[]"
		);

		const results = data.get("results") as string;
		await redis.set(`m1p3#${user.user.userId}`, results);
		const newArray: ClickedValue[] = JSON.parse(results);

		const isSame = compareValuesArray(
			oldArray.filter((x) => x.isSelected),
			newArray.filter((x) => x.isSelected)
		);

		if (!isSame) {
			await clearPurposeStatement(user.user.userId);
			await clearLifePurpose(user.user.userId);
		}

		console.log(
			"oldArray",
			oldArray.filter((x) => x.isSelected)
		);
		console.log(
			"newArray",
			newArray.filter((x) => x.isSelected)
		);

		console.log(isSame);

		return redirect("/module/module1/page4");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const pageModule: FormModule = getModule();
	const jsonval = await redis.get(`m1p2#${user.user.userId}`);
	const jsonval2 = await redis.get(`m1p3#${user.user.userId}`);

	const oldData: ClickedValue[] = JSON.parse(jsonval2 || "[]");

	if (jsonval === null) {
		return redirect("/module1/page1");
	}

	const values: ClickedValue[] = JSON.parse(jsonval);
	values.sort(() => Math.random() - 0.5);

	oldData.forEach((x) => {
		if (
			values.some(
				(v) => v.value.valueId === x.value.valueId && v.isSelected === false
			)
		) {
			x.isSelected = false;
		}
	});

	return json({ pageModule, values, oldData });
};

export default function ThirdPage() {
	const { pageModule, values, oldData } = useLoaderData<typeof loader>();
	const [clickedValues, setclickedvalues] = useState<ClickedValue[]>(oldData);
	const page = pageModule.pages[2];
	const options = values.filter((x) => x.isSelected).map((x) => x.value);
	const maxSelection = clickedValues.filter((x) => x.isSelected).length === 5;

	const handleclick = (e: MouseEvent<HTMLButtonElement>) => {
		const val = options.find(
			(x) => x.valueId === parseInt(e.currentTarget.value)
		)!;

		// verify if the map already has the value
		// if the map has the value, change the state of selected
		// if not, add it with the selected value of true
		var clickedValue = clickedValues.find(
			(x) => x.value?.valueId === val.valueId
		);

		if (!clickedValue) {
			setclickedvalues((value) => [...value, { value: val, isSelected: true }]);
		} else {
			setclickedvalues(
				clickedValues.map((value) =>
					value.value?.valueId === clickedValue?.value.valueId
						? { ...value, isSelected: !value.isSelected }
						: { ...value }
				)
			);
		}
	};

	const buttonList = options.map((v, i) => (
		<div key={i}>
			<Button
				tooltipId={i.toString()}
				limit={maxSelection}
				isSelected={
					clickedValues.find((x) => x.value?.valueId === v.valueId)?.isSelected!
				}
				value={v}
				handleClick={(e) => handleclick(e)}
			/>
		</div>
	));

	return (
		<Container
			pageTitle={page.title}
			pageSubtitle={page.description}
			nextEnabled={maxSelection}
			nextValue={JSON.stringify(clickedValues)}
		>
			<TextComponent text="Shown below are your 10 most important values. Please select your top 5 from among these." />
			<br></br>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center my-4">
				{buttonList}
			</div>
		</Container>
	);
}
