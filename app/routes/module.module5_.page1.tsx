import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Center, Heading, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Link } from "@remix-run/react";
import Container from "~/components/layout/Container";
import TextComponent from "~/components/shared/TextComponent";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	const previous = request.headers
		.get("referer")
		?.split(request.headers.get("host") || "")
		.at(-1);

	const [s1, s2, s3, s4] = await Promise.all([
		redis.lrange(`m2p1#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p2#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p3#${user.user.userId}`, 0, -1),
		redis.lrange(`m2p4#${user.user.userId}`, 0, -1),
	]);

	if (previous === "/module") {
		if (s4.length < 0) {
			return redirect("/module/module2/page5");
		}

		if (s3.length < 0) {
			return redirect("/module/module2/page4");
		}

		if (s2.length < 0) {
			return redirect("/module/module2/page3");
		}

		if (s1.length < 0) {
			return redirect("/module/module2/page2");
		}
	}

	return json({ user });
};

export default function Module5Page1() {
	return (
		<Container first={true} pageTitle="Aspirations" nextEnabled={true}>
			<Text fontSize='lg'>
				Click one of the buttons to navigate to the LifeSpace. Descriptions of each category can be expanded.
			</Text>
			<Stack direction='column' alignItems='center' justifyContent='center' pb={12}>

				<Wrap spacing={8} >
					<WrapItem>
						<Link to='/module/module5/community/page1'>
							<Button colorScheme='gray' size='lg'>Community </Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/leisure/page1'>

							<Button colorScheme='gray' size='lg' >Leisure</Button>
						</Link>

					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/prosperity/page1'>

							<Button colorScheme='gray' size='lg'>Prosperity</Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/relationships/page1'>

							<Button colorScheme='gray' size='lg'>Relationships</Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/vocation/page1'>

							<Button colorScheme='gray' size='lg'>Vocation</Button>
						</Link>

					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/wellbeing/page1'>

							<Button colorScheme='gray' size='lg'>WellBeing</Button>
						</Link>

					</WrapItem>
				</Wrap>
			</Stack>
			{/* <Text fontSize='lg'>
				Click below for more information on each category
			</Text> */}
			<Accordion allowToggle>
				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>
							<Box as='span' flex='1' textAlign='left'>
								Community
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'center' }}>
						<p>
							How you relate to the place you live and the systems that make it run, such as the physical and natural environment, civic organizations, government, and volunteer or charitable activities.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Built environment</li>
							<li>Civic organizations and charities</li>
							<li>Government</li>
							<li>Causes</li>
							<li>Natural environment</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='left'>
							Leisure
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<p>
							What you do for fun and relaxation, as well as more focused or organized activities that you do to enrich your personal life.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Curiosities</li>
							<li>Hobbies</li>
							<li>Social Activities</li>
							<li>Sports</li>
							<li>Travel</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='left'>
							Prosperity
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<p>
							Your current finances and your financial goals, as well as other material accumulations.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Income</li>
							<li>Material Possessions</li>
							<li>Financial Risk</li>
							<li>Wealth</li>
							<li>Debt</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='left'>
							Relationships
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<p>
							Your primary connections to others, including family, friends, romantic partners, and acquaintances.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Romantic partner(s)</li>
							<li>Close Friends</li>
							<li>Acquaintances</li>
							<li>Immediate Family</li>
							<li>Extended Family</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='left'>
							Vocation
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<p>
							The primary role through which you apply yourself, such as a paid job, being a caretaker, or being a student.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Achievements</li>
							<li>Awards</li>
							<li>Credentials</li>
							<li>Competencies</li>
							<li>Vocational Network</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='left'>
							Wellbeing
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<p>
							All aspects of your health across the physical, mental, and spiritual dimensions of your life.
						</p>
						<ul style={{ listStyleType: 'disc', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
							<li>Mental</li>
							<li>Physical</li>
							<li>Spiritual</li>
							<li>Reputational</li>
							<li>Vitality</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>






		</Container>
	);
}
