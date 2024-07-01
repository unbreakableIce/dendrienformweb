import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, MouseEvent } from "react";
import { FormModule } from "~/Data/types/module";
import { ClickedValue } from "~/Data/types/pagemeta";
import Container from "~/components/layout/Container";
import Button from "~/components/shared/Button";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import { getModule } from "~/utils/data";
import TextComponent from "~/components/shared/TextComponent";

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		const results = data.get("oldResults") as string;
		const result = await redis.set("backm1p1#userId", results);
		return redirect("/module/module1/page1");
	}

	if (_action === "next") {
		const results = data.get("results") as string;
		const result = await redis.set(`m1p2#${user.user.userId}`, results);
		return redirect("/module/module1/page3");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const pageModule: FormModule = getModule();
	const jsonval = await redis.get(`m1p1#${user.user.userId}`);
	const jsonval2 = await redis.get(`m1p2#${user.user.userId}`);
	const oldData: ClickedValue[] = JSON.parse(jsonval2 || "[]");

	if (jsonval === null) {
		return redirect("/module/module1/page1");
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

export default function SecondPage() {
	const { pageModule, values, oldData } = useLoaderData<typeof loader>();
	const [clickedValues, setclickedvalues] = useState<ClickedValue[]>(oldData);
	const page = pageModule.pages[1];
	const options = values.filter((x) => x.isSelected).map((x) => x.value);
	const maxSelection =
		clickedValues.filter((x) => x.isSelected).length ===
		page.maxSelectionAllowed;

	const remainedSelection =
		page.maxSelectionAllowed - clickedValues.filter((x) => x.isSelected).length;

	const handleclick = (e: MouseEvent<HTMLButtonElement>) => {
		const val = options.find(
			(x) => x.valueId === parseInt(e.currentTarget.value)
		)!;

		// verify if the map already has the value
		// if the map has the value, change the state of selected
		// if not, add it with the selected value of true
		var clickedValue = clickedValues.find(
			(x) => x.value.valueId === val.valueId
		);

		if (!clickedValue) {
			setclickedvalues((value) => [...value, { value: val, isSelected: true }]);
		} else {
			setclickedvalues(
				clickedValues.map((value) =>
					value.value.valueId === clickedValue?.value.valueId
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
					clickedValues.find((x) => x.value.valueId === v.valueId)?.isSelected!
				}
				value={v}
				handleClick={(e) => handleclick(e)}
			/>
		</div>
	));

	const subtitle = remainedSelection
		? `select ${remainedSelection} more values`
		: undefined;

	return (
		<Container
			pageTitle={page.title}
			pageSubtitle={subtitle}
			nextEnabled={maxSelection}
			nextValue={JSON.stringify(clickedValues)}
		>
			<TextComponent
				text="The values shown here are the 15 that
				 you selected from the previous list (or wrote in).
				  Please select from these the 10 that you feel are most important to you."
			/>
			<br></br>
			<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center my-4">
				{buttonList}
			</div>
		</Container>
	);
}
