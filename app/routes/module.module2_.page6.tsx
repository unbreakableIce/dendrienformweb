import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
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
		return redirect("/module/module2/page5");
	}

	if (_action === "next") {
		return redirect("/module/module3/intro1");
	}
};

export default function FinalModule2() {
	return (
		<SummaryContainer
			pageTitle="Congratulations"
			pageSubtitle=""
			nextEnabled={true}
		>
			<div className="flex flex-col gap-8 content-center flex-wrap px-16  items-center m-32">
				<h2 className="text-3xl font-bold font-mono text-center">
					Well done! You have now completed the Core Characteristics module.
				</h2>
			</div>
				{/*	<h4 className="text-center">
					{" "}
					Click one of the buttons below to go back or move on to the next
					module.
				</h4>
				<Link
					to="/module"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<HomeIcon className="h-6" /> <span>Home page</span>
				</Link>
				<Link
					to="/module/module2/page5"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<ArrowLongLeftIcon className="h-6" /> <span>Module Summary</span>
				</Link>
				<Link
					to="/module/module3/intro1"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg group w-72"
				>
					<span>Next Module </span>
					<ArrowLongRightIcon className="h-6 group-hover:translate-x-6 transition duration-150" />
				</Link>
			</div>
			*/}
		</SummaryContainer>
	);
}
