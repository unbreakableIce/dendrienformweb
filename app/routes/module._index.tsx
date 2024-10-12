import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();
	const { _action } = Object.fromEntries(data);

	switch (_action) {
		case "logout":
			return await authenticator.logout(request, { redirectTo: "/" });
		case "module1":
			return redirect("module1/intro1");
		case "module2":
			return redirect("module2/intro1");
		case "module3":
			return redirect("module3/intro1");
		case "module4":
			return redirect("module4/intro1");
		case "module5":
			return redirect("module5/intro1");
		case "module6":
			return redirect("module6/user-report");
	}
};

export const loader = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const [s1, s2, s3, s4] = await Promise.all([
		redis.get(`m1p3#${user.user.userId}`),
		redis.lrange(`m2p4#${user.user.userId}`, 0, -1),
		redis.get(`m3p1#${user.user.userId}`),
		redis.get(`m4p6#${user.user.userId}`),
	]);

	const [d1, d2, d3, d4] = [!s1, s2.length === 0, !s3, !s4];

	return json({ d1, d2, d3, d4 });
};

export default function Modules() {
	const { d1, d2, d3, d4 } = useLoaderData<typeof loader>();

	return (
		<div className="mx-auto py-16 flex flex-col justify-start gap-8 content-center flex-wrap w-full max-w-[768px] bg-[#d1cdcb] rounded-xl shadow-md px-8 relative">
			<h2 className="text-2xl text-center font-bold">
				Please choose a module.
			</h2>
			<Form method="post" className="flex flex-col gap-4">
				<div className="py-4">
					<button
						name="_action"
						value="module1"
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d1 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap ">
							{/*
							<img
								src="/icons/values.png"
								alt="values"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left ">
							<h3 className="text-lg font-semibold">Root Values</h3>
							<p>
								Your root values reflect what you've identified as the most important to you in life.
							</p>
						</div>
					</button>
				</div>
				<div className="py-4">
					<button
						name="_action"
						value="module2"
						disabled={d1}
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d2 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap justify-center content-center">
							{/*
							<img
								src="/icons/home.png"
								alt="core characteristics"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Core Characteristics</h3>
							<p>
								Your core characteristics indicate how you see yourself, how you
								spend your time and energy, and what social connections are
								central to who you are.{" "}
							</p>
						</div>
					</button>
				</div>
				<div className="py-4">
					<button
						name="_action"
						value="module3"
						disabled={d2}
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d3 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap justify-center content-center">
							{/*
							<img
								src="/icons/purpose.png"
								alt="life purposes"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Life Purpose</h3>
							<p>
								A life purpose is the manifestation of your highest values
								within the context of your core characteristics.
							</p>
						</div>
					</button>
				</div>
				<div className="py-4">
					<button
						name="_action"
						value="module4"
						disabled={d3}
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d4 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap justify-center content-center">
							{/*	<img
								src="/icons/lifeSpace.png"
								alt="LifeSpace Expression"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left">
							<h3 className="text-lg font-semibold">LifeSpace Expressions</h3>
							<p>
								Your purpose can be expressed in unique ways within the various
								dimensions of your life.
							</p>
						</div>
					</button>
				</div>
				<div className="py-4">
					<button
						name="_action"
						value="module5"
						disabled={d3}
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d4 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap justify-center content-center">
							{/*	<img
								src="/icons/lifeSpace.png"
								alt="LifeSpace Expression"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Aspirations</h3>
							<p>
								Aspirations reflect goals you would like to pursue regarding what you wish to achieve, the kind of person you wish to become, or how you want to connect with others.
							</p>
						</div>
					</button>
				</div>
				<div className="py-4">
					<button
						name="_action"
						value="module6"
						disabled={d3}
						className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-h-[125px] min-w-[350px] max-w-[500px] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 ${d4 ? "" : "bg-[#b7b1ae]"
							}`}
					>
						<div className="flex flex-wrap justify-center content-center">
							{/*	<img
								src="/icons/lifeSpace.png"
								alt="LifeSpace Expression"
								className="rounded-full"
								width="128px"
								height="128px"
							/>
							*/}
						</div>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Individual Report</h3>
							<p>
								View your summary report, including our assessment of the fundamental ideals that reflect the essence of who you are and what's most important to you.
							</p>
						</div>
					</button>
				</div>

			</Form>
		</div>
	);
}
