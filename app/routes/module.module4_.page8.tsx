import {
	HomeIcon,
	ArrowLongRightIcon,
	ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import SummaryContainer from "~/components/layout/SummaryContainer";
import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};
export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);


	if (_action === "back") {
		return redirect("/module/module4/page7");
	}

	if (_action === "next") {
		return redirect("/module/module5/intro1");
	}
};
export default function Page8Module4() {
	return (
		<SummaryContainer
			pageTitle="Congratulations"
			pageSubtitle=""
			nextEnabled={true}
		>
			<div className="flex flex-col gap-8 content-center flex-wrap px-16  items-center m-32">
				<h3 className="sm:text-3xl font-bold font-mono text-center">
					You have now completed the Lifespace Expressions module. Congratulations! Click Next Module to move on to the next module.
				</h3>

			</div>
			{/*
			<div className="flex flex-col gap-8 content-center flex-wrap px-16 items-center sm:m-32">
				<h3 className="sm:text-3xl font-bold font-mono text-center">
					You have now completed all available modules. Congratulations! We hope
					this experience produced some powerful insights that you will be able
					to use in your daily life.
				</h3>

				<p className="text-center">
					Expect to hear from us soon, and keep an eye out for new modules in
					the near future. For now, you can take your Purpose Statement and
					LifeSpace Expressions and return to the main conference room to
					discuss these further.
				</p>

				<Link
					to="/module"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<HomeIcon className="h-6" /> <span>Home</span>
				</Link>
				<Link
					to="/module/module4/page7"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<ArrowLongLeftIcon className="h-6" /> <span>Module Summary</span>
				</Link>
				{/*}
			<Link
				to="/module"
				className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg group"
			>
				<span>Uncover your aspirations</span>
				<ArrowLongRightIcon className="h-6 group-hover:translate-x-6 transition duration-150" />
			</Link>
			</div>
			*/}

		</SummaryContainer>
	);
}
