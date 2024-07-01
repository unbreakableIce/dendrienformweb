import { ActionFunctionArgs, redirect } from "@remix-run/node";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";

export const action = async ({ request }: ActionFunctionArgs) => {
	return redirect("/module");
};

export default function Home() {
	return (
		<Container pageTitle="Welcome" nextEnabled={true}>
			<TextComponent text="Welcome to Dendrien." />
			<br />
			<TextComponent text="We hope you enjoy the modules we have created for you. Each module contains simple exercises, based on decades worth of research, that are designed to help you determine your root values, describe your core characteristics, articulate an overarching purpose, and express that purpose across the primary domains of your life." />
			<br />
			<TextComponent text="If you are ready to understand yourself at a deeper level than you ever have before, then let's begin." />
		</Container>
	);
}
