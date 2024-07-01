import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { MouseEvent } from "react";
import { FormModule, Value } from "~/Data/types/module";
import { ClickedValue } from "~/Data/types/pagemeta";
import Container from "~/components/layout/Container";
import Button from "~/components/shared/Button";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import { getModule } from "~/utils/data";
import TextComponent from "~/components/shared/TextComponent";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "startOver") {
		return redirect("/module/module1/intro1");
	}

	if (_action === "back") {
		return redirect("/module/module1/page3");
	}

	if (_action === "next") {
		return redirect("/module/module1/page5");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const pageModule: FormModule = getModule();
	const jsonval = await redis.get(`m1p3#${user.user.userId}`);

	if (jsonval === null) {
		return redirect("/module1/page1");
	}

	const clickedValue: ClickedValue[] = JSON.parse(jsonval);
	const values = clickedValue.filter((x) => x.isSelected).map((x) => x.value);

	return json({ pageModule, values });
};

export default function FourthPage() {
	const { pageModule, values } = useLoaderData<typeof loader>();

	const page = pageModule.pages[3];

	function handleclick(e: MouseEvent<HTMLButtonElement>): void {
		return;
	}

	const buttonList = values.map((v, i) => (
		<div key={i}>
			<Button
				tooltipId={i.toString()}
				limit={true}
				isSelected={true}
				value={v}
				handleClick={(e) => handleclick(e)}
			/>
		</div>
	));

	return (
		<Container
			pageTitle={page.title}
			pageSubtitle={page.description}
			nextEnabled={true}
		>
			<div className="w-full h-full relative">
				<TextComponent
					text="
				Please review the values below. If you are satisfied that these reflect your most important values,
				then click the 'Next' button to accept them and go on to the next module.
				Otherwise, click 'Back' to change your core values."
				/>

				<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center my-4">

					{buttonList}
				</div>
				<Form method="post" className="absolute bottom-4 left-0">
					<button
						name="_action"
						value="startOver"
						className="px-4 py-2 border-2 border-black rounded-xl hover:bg-[#b8c1b6]"
					>
						Start Over
					</button>
				</Form>
			</div>
		</Container>
	);
}
