import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import Container from "~/components/layout/Container";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const { _action } = Object.fromEntries(formData);

	if (_action === "back") {
		return redirect("/module/module4/intro1");
	}

	if (_action === "next") {
		return redirect("/module/module4/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});
};

export default function Intro2Module4() {
	return (
		<Container pageTitle="Purpose in Each Part of My Life" nextEnabled={true}>
			<h3 className="font-semibold text-xl mb-4">
				Consider the following LifeSpaces…
			</h3>
			<div className="overflow-x-auto shadow-md sm:rounded-lg w-10/12 mx-auto overflow-clip mb-8">
				<table className="w-full text-left rtl:text-right text-black text-lg">
					<thead className="uppercase bg-gray-400">
						<tr>
							<th className="px-6 py-6">LifeSpace</th>
							<th className="px-6 py-6">Description</th>
						</tr>
					</thead>
					<tbody>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Community</td>
							<td className="px-6 py-6">
								How you relate to the place you live and the systems that make
								it run, such as the physical and natural environment, civic
								organizations, government, and volunteer or charitable
								activities
							</td>
						</tr>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Leisure</td>
							<td className="px-6 py-6">
								What you do for fun and relaxation, as well as more focused or
								organized activities that you do to enrich your personal life
							</td>
						</tr>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Prosperity</td>
							<td className="px-6 py-6">
								Your current finances and your financial goals, as well as other
								material accumulations
							</td>
						</tr>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Relationships</td>
							<td className="px-6 py-6">
								Your primary connections to others, including family, friends,
								romantic partners, and acquaintances
							</td>
						</tr>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Vocation</td>
							<td className="px-6 py-6">
								The primary role through which you apply yourself, such as a
								paid job, being a caretaker, or being a student
							</td>
						</tr>
						<tr className="odd:bg-[#ffffff] even:bg-[#b8c1b6] even:text-black border-b border-gray-700">
							<td className="px-6 py-6">Wellbeing</td>
							<td className="px-6 py-6">
								All aspects of your health across the physical, mental, and
								spiritual dimensions of your life
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Container>
	);
}
