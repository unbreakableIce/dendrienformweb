import stylesheet from "~/tailwind.css?url";
import type {
	ActionFunctionArgs,
	LinksFunction,
	LoaderFunctionArgs,
} from "@remix-run/node";
import {
	Form,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
	useNavigation,
	useRouteError,
} from "@remix-run/react";
import { authenticator } from "./utils/auth.server";
import Spinner from "./components/layout/Spinner";
import { HomeIcon } from "@heroicons/react/24/outline";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export const action = async ({ request }: ActionFunctionArgs) => {
	return await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request);

	return json({ user });
};

export default function App() {
	const { user } = useLoaderData<typeof loader>();
	const navigation = useNavigation();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-white/60">
				<div className="h-screen mx-auto flex flex-col justify-stretch content-center gap-4 bg-[#DADDCD] py-4">
					<div className="sticky top-0 flex flex-wrap items-center justify-center gap-8">
						<Link
							className="px-8 py-2 flex flex-wrap justify-start content-center gap-4 text-gray-800 text-2xl font-bold capitalize hover:text-blue-700"
							to="/module"
						>
							<HomeIcon className="h-6 mt-1" />
							<span className="hidden sm:inline text-lg">Home</span>
						</Link>
						<Link to="/module">
							<img
								src="/icons/Full_TransparentBlack.png"
								alt="Dendrien logo"
								width="300px"
							/>
						</Link>
						{user && (
							<Form method="post">
								<label>
									{user.user.firstname} {user.user.lastname}
								</label>
								<span className="px-1">&nbsp;</span>
								<button
									name="_action"
									value="logout"
									className="p-2 hover:bg-red-500 outline-none border border-red-500 border-spacing-3 rounded-lg"
								>
									Log out
								</button>
							</Form>
						)}
					</div>
					<div
						className={`overflow-scroll flex-grow ${
							navigation.state === "loading" ? "loading" : ""
						}`}
					>
						{navigation.state === "loading" && <Spinner />}
						<Outlet />
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	console.error(error);
	return (
		<html>
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body className="h-screen w-screen flex flex-wrap justify-center content-center items-center">
				<div className="flex flex-col gap-8">
					<h1 className="text-5xl text-center font-bold font-mono text-red-500">
						There was a big problem!!!
					</h1>
					<div className="flex flex-col gap-2">
						<p className="text-center font-semibold font-sans">
							An error occurred and we're actively working on it.
						</p>
						<p className="text-center font-semibold font-sans">
							Thank you for your patience.
						</p>
						<Link
							className="border border-blue-500 rounded-xl px-4 py-2"
							to="/"
						>
							Home
						</Link>
					</div>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
