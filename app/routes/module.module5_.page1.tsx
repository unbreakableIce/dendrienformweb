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

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.formData();

	const { _action } = Object.fromEntries(data);

	if (_action === "back" || _action === "home") {
		return redirect("/module");
	}

	if (_action === "next") {
		return redirect("/module/module5/community/page1");
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/",
	});

	return json({ user });
};

export default function Module5Page1() {
	return (
		<Container first={true} pageTitle="Aspirations" nextEnabled={true}>
			<Text fontSize='lg'>
				Click one of the buttons below to navigate to a LifeSpace. Detailed descriptions of each LifeSpace can be displayed by expanding items in the menu below these buttons.
			</Text>
			<Stack direction='column' alignItems='center' justifyContent='center' pt={8} pb={12}>

				<Wrap spacing={8} >
					<WrapItem>
						<Link to='/module/module5/community/page1'>
							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black'>Community </Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/leisure/page1'>

							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black'>Leisure</Button>
						</Link>

					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/prosperity/page1'>

							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black' >Prosperity</Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/relationships/page1'>

							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black'>Relationships</Button>
						</Link>
					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/vocation/page1'>

							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black'>Vocation</Button>
						</Link>

					</WrapItem>
					<WrapItem>
						<Link to='/module/module5/wellbeing/page1'>

							<Button colorScheme='gray' size='lg' border='2px'
								borderColor='black'>WellBeing</Button>
						</Link>

					</WrapItem>
				</Wrap>
			</Stack>

			<Accordion allowToggle>
				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>
							<Box as='span' flex='1' textAlign='center'>
								Community
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							How you relate to the place you live and the systems that make it run, such as the physical and natural environment, civic organizations, government, and volunteer or charitable activities.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>							<li>Built environment</li>
							<li>Civic organizations and charities</li>
							<li>Government</li>
							<li>Causes</li>
							<li>Natural environment</li>
						</ul>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>
							<Box as='span' flex='1' textAlign='center'>
								Leisure
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							What you do for fun and relaxation, as well as more focused or organized activities that you do to enrich your personal life.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
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
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>
							<Box as='span' flex='1' textAlign='center'>
								Prosperity
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							Your current finances and your financial goals, as well as other material accumulations.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
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
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='center'>
							Relationships
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							Your primary connections to others, including family, friends, romantic partners, and acquaintances.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
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
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='center'>
							Vocation
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							The primary role through which you apply yourself, such as a paid job, being a caretaker, or being a student.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
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
						<AccordionButton _expanded={{ bg: 'black', color: 'white' }}>							<Box as='span' flex='1' textAlign='center'>
							Wellbeing
						</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4} style={{ textAlign: 'left' }}>
						<p>
							All aspects of your health across the physical, mental, and spiritual dimensions of your life.
						</p>
						<ul style={{ listStyleType: 'disc', paddingTop: '10px', paddingLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
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
