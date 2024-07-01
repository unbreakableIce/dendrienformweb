import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MouseEvent, useState } from "react";
import Container from "~/components/layout/Container";
import ChoiceInput from "~/components/shared/ChoiceInput";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import { clearLifePurpose, clearPurposeStatement } from "~/utils/redisUtils";
import { compareStringArray } from "~/utils/utilsFunc";

type clickedValue = {
	value: string;
	isSelected: boolean;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const formData = await request.formData();
	const { _action } = Object.fromEntries(formData);

	if (_action === "back") {
		return redirect("/module/module2/page3");
	}

	if (_action === "next") {
		const results = formData.get("results") as string;
		const clickedValues: clickedValue[] = JSON.parse(results);
		const arr = clickedValues.filter((x) => x.isSelected).map((x) => x.value);
		const oldarray = await redis.lrange(`m2p4#${user.user.userId}`, 0, -1);
		const isSame = compareStringArray(oldarray, arr);

		if (!isSame) {
			await clearPurposeStatement(user.user.userId);
			await clearLifePurpose(user.user.userId);
		}

		await redis.del(`m2p4#${user.user.userId}`);
		await redis.lpush(`m2p4#${user.user.userId}`, ...arr);
		return redirect("/module/module2/page5");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const [values1, values2, values3, selectedValue] = await Promise.all([
		redis.lrange(`m2p1#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p2#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p3#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p4#${user.user.userId}`, 0, -1),
	]);

	const list = [
		...values1.filter((x) => x !== ""),
		...values2.filter((x) => x !== ""),
		...values3.filter((x) => x !== ""),
	].sort(() => Math.random() - 0.5);

	if (values1.length <= 0 || values2.length <= 0 || values3.length <= 0) {
		throw new Error(
			"A page have not been filled out, please fill all the pages to complete this page"
		);
	}

	selectedValue.forEach((x, i, arr) => {
		if (list.every((val) => val !== x)) {
			arr.splice(i, 1);
		}
	});

	return json({ list, selectedValue, user });
};

export default function ForthModule2() {
	const { list, selectedValue, user } = useLoaderData<typeof loader>();

	const cv: clickedValue[] = selectedValue.map((x) => ({
		value: x,
		isSelected: true,
	}));

	const [clickedValues, setclickedValues] = useState<clickedValue[]>(cv);

	const handleclick = (e: MouseEvent<HTMLButtonElement>) => {
		const value = e.currentTarget.value;

		const isclicked = clickedValues.find((x) => x.value === value);

		if (!isclicked) {
			setclickedValues((val) => [...val, { value, isSelected: true }]);
		} else {
			setclickedValues(
				clickedValues.map((val) =>
					val.value === isclicked.value
						? { ...val, isSelected: !val.isSelected }
						: { ...val }
				)
			);
		}
	};

	const buttonList = list.map((v, i) => (
		<div key={i}>
			<ChoiceInput
				limit={clickedValues.filter((x) => x.isSelected).length === 5}
				isSelected={
					clickedValues.find((x) => x.value === v)?.isSelected || false
				}
				text={v}
				handleClick={handleclick}
			/>
		</div>
	));

	return (
		<Container
			pageTitle={`${user.user.firstname}'s Core Characteristics`}
			nextEnabled={clickedValues.filter((x) => x.isSelected).length === 5}
			nextValue={JSON.stringify(clickedValues)}
		>
			<div className="flex flex-col gap-8 px-8">
				<h3 className="text-2xl text-center">
					Now, look at the core characteristics that you listed in the previous
					exercise. Consider this list carefully and{" "}
					<span>select the 5 characteristics</span> that you feel best describe
					how you see yourself.{" "}
				</h3>
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2 mx-auto justify-items-start">
					{buttonList}
				</div>
			</div>
		</Container>
	);
}
