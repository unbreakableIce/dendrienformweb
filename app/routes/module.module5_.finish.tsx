import {
	HomeIcon,
	ArrowLongRightIcon,
	ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import CongratsContainer from "~/components/layout/CongratsContainer";
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
		return redirect("/module/module5/wellbeing/page1");
	}

	if (_action === "next") {
		return redirect("/module/module6/user-report");
	}
};
export default function Module5FinishPage() {
	return (
		<CongratsContainer
			pageTitle="Congratulations"
			pageSubtitle=""
			nextEnabled={true}
		>
			<div className="flex flex-col gap-8 content-center flex-wrap px-16  items-center m-32">
				<h3 className="sm:text-3xl font-bold font-mono text-center">
					You have now completed the Aspirations module. Congratulations! Click Next Module to move on to see your User Report.
				</h3>

			</div>
		</CongratsContainer>
	);
}
