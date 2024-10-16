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
		return redirect("/module/module3/page1");
	}

	if (_action === "next") {
		return redirect("/module/module4/intro1");
	}
};

export default function ThirdPageModule3() {
	return (
		<SummaryContainer
			pageTitle="Congratulations"
			pageSubtitle=""
			nextEnabled={true}
		>
			<div className="flex flex-col gap-8 content-center flex-wrap px-16  items-center m-32">
				<h3 className="text-3xl font-bold text-center">
					You now have a life purpose statement! Congratulations.
				</h3>
				<h4 className="text-xl font-bold  text-center w-8/12">
					If you did not write it down or copy it to the clipboard, click the Module Summary button to go back and do so before moving forward with the next module.
				</h4>
			</div>
			{/*
			<div className="flex flex-col gap-8 content-center flex-wrap px-16 items-center m-32">
				<h3 className="text-3xl font-bold text-center">
					You now have a life purpose statement! Congratulations.
				</h3>
				<h4 className="text-xl font-bold text-center w-8/12">
					If you did not write it down or copy it to the clipboard, you might
					want to click the Summary button below to go back and do so before
					moving forward with the next module.
				</h4>
				<p className="text-center">
					{" "}
					Click the ‘Next Module’ button to explore ways to express this purpose
					within various domains of your life.
				</p>
				<Link
					to="/module"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<HomeIcon className="h-6" /> <span>Home page</span>
				</Link>
				<Link
					to="/module/module3/page1"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72"
				>
					<ArrowLongLeftIcon className="h-6" /> <span>Module Summary</span>
				</Link>
				<Link
					to="/module/module4/intro1"
					className="flex flex-wrap justify-center content-center gap-4 outline outline-2 outline-offset-2 outline-[#802E34] hover:bg-[#F1E6E2] px-8 py-2 rounded-lg w-72 group"
				>
					<span>Next Module</span>
					<ArrowLongRightIcon className="h-6 group-hover:translate-x-6 transition duration-150" />
				</Link>
			</div>
			*/}
		</SummaryContainer>
	);
}
