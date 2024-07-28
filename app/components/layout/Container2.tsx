import {
	ChevronLeftIcon,
	ChevronRightIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import { Form } from "@remix-run/react";

const Container2 = ({
	pageTitle,
	children,
	first,
}: {
	pageTitle: string;
	children: React.ReactNode;
	first?: boolean;
}) => {
	return (
		<div className="pb-8 flex flex-col content-center text-center gap-8 border-2 border-[#454545] bg-[#F3F3F3] w-full sm:w-8/12 mx-auto rounded-xl overflow-clip shadow-xl shadow-gray-500 h-[85vh]">
			<div className="sticky top-0 w-full bg-[#bcbcbc] py-4 px-0 sm:px-2 md:px-4 lg:px-8 flex justify-between shadow-md shadow-gray-300 vertical-align:bottom">
				<Form method="post">
					{first ? (
						<button
							name="_action"
							value="home"
							className="px-8 py-2 flex flex-wrap justify-start content-center gap-4 text-gray-800 text-2xl font-bold capitalize hover:text-white"
						>
							<HomeIcon className="h-6 mt-1" />
							<span className="hidden sm:inline text-lg">Home</span>
						</button>
					) : (
						<button
							name="_action"
							value="back"
							className="px-8 py-2 flex flex-wrap justify-start content-center gap-4 text-gray-800 text-2xl font-bold capitalize hover:text-white group"
						>
							<ChevronLeftIcon className="h-6 mt-1 group-hover:-translate-x-6 transition ease-in-out duration-200" />
							<span className="hidden sm:inline text-lg">back</span>
						</button>
					)}
				</Form>
				<div>
					<h3 className="sm:text-lg md:text-xl lg:text-2xl font-semibold md:font-bold">
						{pageTitle}
					</h3>
				</div>
				<Form method="post" id="valuesForm">
					<button
						name="_action"
						value="next"
						type="submit"
						className={`px-8 py-2 flex flex-wrap justify-start content-cente gap-4 rounded-3xl text-gray-800 text-2xl font-bold capitalize hover:text-white group`}
					>
						<span className="hidden sm:inline  text-lg">next</span>
						<ChevronRightIcon className="h-6 mt-1 group-hover:translate-x-6 transition ease-in-out duration-200" />
					</button>
				</Form>
			</div>
			<div className="px-4 h-full overflow-y-scroll">{children}</div>
		</div>
	);
};
export default Container2;
