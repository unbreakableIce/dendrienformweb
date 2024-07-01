import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MouseEvent, useState } from "react";
import { FormModule, Value } from "~/Data/types/module";
import { ClickedValue } from "~/Data/types/pagemeta";
import Button from "~/components/shared/Button";
import Container from "~/components/layout/Container";
import redis from "~/utils/connection";
import { getModule } from "~/utils/data";
import { getRandomIntInclusive } from "~/utils/utilsFunc";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	// TODO: Send meta data to the backend

	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const data = await request.formData();
	const { _action } = Object.fromEntries(data);

	if (_action === "back") {
		return redirect("/module/module1/intro1");
	}

	if (_action === "next") {
		const results = data.get("results") as string;
		const result = await redis.set(`m1p1#${user.user.userId}`, results);
		return redirect("/module/module1/page2");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// const moduleId = "";
	// TODO: Get page from the registered module on redis
	// const module = await getModule(moduleId);
	// TODO: Get last visit from backend and pre populate form if it's not null
	// TODO: Get selected value from last page if it's not the first page

	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const pageModule: FormModule = getModule();
	pageModule.values.sort(() => Math.random() - 0.5);
	const jsonval = await redis.get(`m1p1#${user.user.userId}`);
	const oldData: ClickedValue[] = JSON.parse(jsonval || "[]");

	return json({ pageModule, oldData });
};

export default function FirstPage() {
	const { pageModule, oldData } = useLoaderData<typeof loader>();
	const [clickedValues, setclickedvalues] = useState<ClickedValue[]>(
		oldData || []
	);
	const [userValues, setuserValues] = useState<Value[]>([]);
	const [show, setshow] = useState(false);
	const page = pageModule.pages[0];
	const maxSelection =
		clickedValues.filter((x) => x.isSelected).length ===
		page.maxSelectionAllowed;
	const remainedSelection =
		page.maxSelectionAllowed - clickedValues.filter((x) => x.isSelected).length;

	const onAddValue = (value: Value) => {
		setuserValues((val) => [...val, value]);
	};

	const handleclick = (e: MouseEvent<HTMLButtonElement>) => {
		const val = [...userValues, ...pageModule.values].find(
			(x) => x.valueId === parseInt(e.currentTarget.value)
		)!;

		// verify if the map already has the value
		// if the map has the value, change the state of selected
		// if not, add it with the selected value of true
		const clickedValue = clickedValues.find(
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

	const buttonList = [...userValues, ...pageModule.values].map((v, i) => (
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
		? `Select ${remainedSelection} more`
		: undefined;

	return (
		<Container
			pageTitle={page.title}
			pageSubtitle={subtitle}
			nextEnabled={maxSelection}
			nextValue={JSON.stringify(clickedValues)}
		>
			<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center my-4">
				<button
					onClick={() => setshow(true)}
					disabled={userValues.length === 5}
					className="outline outline-2 outline-offset-2 outline-[#454545] rounded-lg px-6 py-2 flex flex-col gap-4 justify-center content-center flex-wrap w-40"
					type="button"
				>
					{/*
					<img
						src="/icons/add.png"
						alt="add Button"
						width="70px"
						height="70px"
					/>
					*/}
					<span>Add value</span>
				</button>
				{buttonList}
			</div>
			<ModalAddValue
				isOpen={show}
				add={onAddValue}
				cancel={() => setshow(false)}
			/>
		</Container>
	);
}

const ModalAddValue = ({
	isOpen,
	add,
	cancel,
}: {
	isOpen: boolean;
	add: (value: Value) => void;
	cancel: () => void;
}) => {
	const [label, setlabel] = useState("");
	const [description, setdescription] = useState("");

	const onclick = () => {
		const value: Value = {
			valueId: getRandomIntInclusive(70, 80),
			label,
			description,
			icon: "/icons/question-mark.png",
		};

		add(value);
		onClose();
	};

	const onClose = () => {
		setlabel("");
		setdescription("");
		cancel();
	};

	return (
		<div
			className={`h-screen w-screen fixed top-0 left-0 bg-gray-600/80 z-10 flex flex-wrap justify-center content-center ${
				isOpen ? "" : "hidden"
			}`}
			onClick={onClose}
		>
			<form
				onClick={(e) => e.stopPropagation()}
				autoComplete="off"
				className="flex flex-col gap-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 p-8 rounded-lg w-[450px]"
			>
				<div>
					<h1 className="text-2xl font-bold text-center">Add your own value</h1>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-lg font-semibold text-left" htmlFor="label">
						Label
					</label>
					<input
						className="outline-none border-2 border-black px-4 py-2 rounded-md"
						id="label"
						type="text"
						value={label}
						onChange={(e) => setlabel(e.target.value)}
					/>
				</div>
				{/*	<div className="flex flex-col gap-2">
					<label
						className="text-lg font-semibold text-left"
						htmlFor="description"
					>
						Description
					</label>
					<textarea
						id="description"
						className="outline-none border-2 border-black px-4 py-2 rounded-md"
						value={description}
						onChange={(e) => setdescription(e.target.value)}
					></textarea>
				</div> */}
				<div className="flex justify-evenly">
					<button
						className="rounded-lg px-4 py-2 bg-green-500 text-white"
						onClick={onclick}
						type="button"
					>
						Save
					</button>
					<button
						className="border-2 border-red-500 px-4 py-2 rounded-lg bg-white"
						onClick={onClose}
						type="button"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};
