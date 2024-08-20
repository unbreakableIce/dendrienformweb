import { Box, Button, Card, CardBody, CardHeader, Heading, ListItem, OrderedList, Stack, StackDivider, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import { LoaderFunctionArgs, redirect, json, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import OpenAI from "openai";
import Container from "~/components/layout/Container";
import { authenticator } from "~/utils/auth.server";
import redis from "~/utils/connection";
import { getModule } from "~/utils/data";

export const action = async ({ request }: ActionFunctionArgs) => {
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
    });

    let [userInfo, top10coreValues, top5coreCharacteristics, purposeStatement, lseCommunity, lseLeisure, lseProsperity, lseRelationships, lseVocation, lseWellbeing, aspirationCommunity, aspirationLeisure, aspirationProsperity, aspirationRelationships, aspirationVocation, aspirationWellbeing, trueIdeals, latentValueThemes] = await Promise.all([
        user, // user
        redis.get(`m1p2#${user.user.userId}`), //top 10 core values
        redis.lrange(`m2p4#${user.user.userId}`, 0, -1), //top 5 core characteristics
        redis.get(`m3p1#${user.user.userId}`), // purpose statement
        redis.get(`m4p1#${user.user.userId}`), // LSE community
        redis.get(`m4p2#${user.user.userId}`), // LSE leisure
        redis.get(`m4p3#${user.user.userId}`), // LSE prosperity
        redis.get(`m4p4#${user.user.userId}`), // LSE relationships
        redis.get(`m4p5#${user.user.userId}`), // LSE vocation
        redis.get(`m4p6#${user.user.userId}`), // LSE wellbeing
        redis.get(`module5:community:user:${user.user.userId}`), // aspirations community
        redis.get(`module5:leisure:user:${user.user.userId}`), // aspirations leisure
        redis.get(`module5:prosperity:user:${user.user.userId}`), // aspirations prosperity
        redis.get(`module5:relationships:user:${user.user.userId}`), // aspirations relationships
        redis.get(`module5:vocation:user:${user.user.userId}`), // aspirations vocation
        redis.get(`module5:wellbeing:user:${user.user.userId}`), // aspirations wellbeing
        redis.get(`module6:trueIdeals:user:${user.user.userId}`), // true ideals
        redis.get(`module6:latentValueThemes:user:${user.user.userId}`), // latent value themes
    ]);

    let response = '';
    //check if latent value themes and true ideals are already generated
    if (!trueIdeals && !latentValueThemes) {

        const prompt = `I want you to infer the true ideals of a person based on five sets of information: their top 10 values, their  5 core characteristics, their life purpose, their LifeSpace expressions of their purpose, and their short-term aspirations. 
    
    TOP 10 CORE VALUES: ${top10coreValues}
    TOP 5 CORE CHARACTERISTICS: ${top5coreCharacteristics}
    LIFE PURPOSE: ${purposeStatement}
    LSE COMMUNITY: ${lseCommunity}
    LSE LEISURE: ${lseLeisure}
    LSE PROSPERITY: ${lseProsperity}
    LSE RELATIONSHIPS: ${lseRelationships}
    LSE VOCATION: ${lseVocation}
    LSE WELLBEING: ${lseWellbeing}
    ASPIRATIONS COMMUNITY: ${aspirationCommunity}
    ASPIRATIONS LEISURE: ${aspirationLeisure}
    ASPIRATIONS PROSPERITY: ${aspirationProsperity}
    ASPIRATIONS RELATIONSHIPS: ${aspirationRelationships}
    ASPIRATIONS VOCATION: ${aspirationVocation}
    ASPIRATIONS WELLBEING: ${aspirationWellbeing}

    First, identify 2 latent themes among their top 10 values. Make sure that each theme is a singular, coherent idea, and don’t try to combine too many distinct ideas into a single latent them name. Use additional latent themes if necessary to avoid combining distinct ideas under one latent theme. Next, connect these latent themes to how they describe themselves (their core characteristics), giving extra weight to areas of semantic overlap between their latent value themes and their core characteristics. Then integrate any new information provided by their purpose statement, their LifeSpace expressions of their purpose, and their short-term aspirations to infer their true ideals, giving more weight to information provided by their short-term aspirations if their aspirations seem to conflict with the other information.
    
    The response must be in this format:
    {
    "latent_value_themes": ["theme1"," theme2"], "true_ideals": ["ideal1","ideal2"]}

    `;

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            stream: false,
        });

        response = completion.choices[0].message.content || '';
        const json = JSON.parse(response);
        redis.set(`module6:trueIdeals:user:${user.user.userId}`, JSON.stringify(json.true_ideals));
        redis.set(`module6:latentValueThemes:user:${user.user.userId}`, JSON.stringify(json.latent_value_themes));
        trueIdeals = await redis.get(`module6:trueIdeals:user:${user.user.userId}`);
        latentValueThemes = await redis.get(`module6:latentValueThemes:user:${user.user.userId}`);
    }

    const userData = { userInfo, top10coreValues, top5coreCharacteristics, purposeStatement, lseCommunity, lseLeisure, lseProsperity, lseRelationships, lseVocation, lseWellbeing, aspirationCommunity, aspirationLeisure, aspirationProsperity, aspirationRelationships, aspirationVocation, aspirationWellbeing, trueIdeals, latentValueThemes };

    return JSON.stringify(userData);
};


export default function ModuleIndividualReport() {
    const data = useLoaderData<typeof loader>();
    const userSummary = JSON.parse(data);
    const latentValueThemes = JSON.parse(userSummary.latentValueThemes);
    const trueIdeals = JSON.parse(userSummary.trueIdeals);

    const top10coreValues = JSON.parse(userSummary.top10coreValues);
    const aspirationCommunity = JSON.parse(userSummary.aspirationCommunity);
    const aspirationLeisure = JSON.parse(userSummary.aspirationLeisure);
    const aspirationProsperity = JSON.parse(userSummary.aspirationProsperity);
    const aspirationRelationships = JSON.parse(userSummary.aspirationRelationships);
    const aspirationVocation = JSON.parse(userSummary.aspirationVocation);
    const aspirationWellbeing = JSON.parse(userSummary.aspirationWellbeing);


    return (
        <Container first={false} pageTitle={'My Report'} nextEnabled={false} >
            <Heading mb={4} textAlign={"left"} size={'lg'}>
                Name: {userSummary.userInfo.user.firstname} {userSummary.userInfo.user.lastname}
            </Heading>
            <Text fontSize='xl' textAlign={'left'} pb={4}>
                My root values (what is most important to me in life) are:
            </Text>
            <OrderedList textAlign='left' pb={8} >
                <ListItem>{top10coreValues[0].value.label}</ListItem>
                <ListItem>{top10coreValues[1].value.label}</ListItem>
                <ListItem>{top10coreValues[2].value.label}</ListItem>
                <ListItem>{top10coreValues[3].value.label}</ListItem>
                <ListItem>{top10coreValues[4].value.label}</ListItem>
                <ListItem>{top10coreValues[5].value.label}</ListItem>
                <ListItem>{top10coreValues[6].value.label}</ListItem>
                <ListItem>{top10coreValues[7].value.label}</ListItem>
                <ListItem>{top10coreValues[8].value.label}</ListItem>
                <ListItem>{top10coreValues[9].value.label}</ListItem>
                <ListItem>{top10coreValues[0].value.label}</ListItem>
            </OrderedList>
            <Text fontSize='xl' textAlign={'left'} pb={4}>
                My core characteristics (how I primarily define and describe myself) are:
            </Text>
            <OrderedList textAlign='left' pb={8}>
                <ListItem>{userSummary.top5coreCharacteristics[0]}</ListItem>
                <ListItem>{userSummary.top5coreCharacteristics[1]}</ListItem>
                <ListItem>{userSummary.top5coreCharacteristics[2]}</ListItem>
                <ListItem>{userSummary.top5coreCharacteristics[3]}</ListItem>
                <ListItem>{userSummary.top5coreCharacteristics[4]}</ListItem>
            </OrderedList>
            <Text fontSize='xl' textAlign={'left'} pb={4}>
                My life purpose statement is:
            </Text>
            <Text fontSize='l' textAlign={'left'} pb={8}>
                {userSummary.purposeStatement}
            </Text>
            <Text fontSize='xl' textAlign={'left'} pb={4}>
                My life purpose can be expressed across the primary spaces of my life in the following ways:
            </Text>
            <UnorderedList textAlign='left' pb={8}>
                <ListItem>Vocation: {userSummary.lseVocation}</ListItem>
                <ListItem>Relationships: {userSummary.lseRelationships}</ListItem>
                <ListItem>Wellbeing: {userSummary.lseWellbeing}</ListItem>
                <ListItem>Prosperity: {userSummary.lseProsperity}</ListItem>
                <ListItem>Community: {userSummary.lseCommunity}</ListItem>
                <ListItem>Leisure: {userSummary.lseLeisure}</ListItem>
            </UnorderedList>
            <Text fontSize='xl' textAlign={'left'} pb={4}>
                These are the aspirations I want to pursue next in my life:
            </Text>
            {/*
            
            */}
            <UnorderedList textAlign='left' pb={8}>
                {Object.keys(aspirationCommunity).map((key, index) => {
                    const value = aspirationCommunity[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

                {Object.keys(aspirationLeisure).map((key, index) => {
                    const value = aspirationLeisure[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

                {Object.keys(aspirationProsperity).map((key, index) => {
                    const value = aspirationProsperity[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

                {Object.keys(aspirationRelationships).map((key, index) => {
                    const value = aspirationRelationships[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

                {Object.keys(aspirationVocation).map((key, index) => {
                    const value = aspirationVocation[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

                {Object.keys(aspirationWellbeing).map((key, index) => {
                    const value = aspirationWellbeing[key];
                    return value !== '' ? (
                        <ListItem key={index}> {value}</ListItem>
                    ) : null;
                })}

            </UnorderedList>


            <Text fontSize='xl' textAlign={'left'} pb={4}>
                Below are the True Ideals at the heart of who I am as a person. These True Ideals reflect what really drives my life and the essence of my existence on planet Earth:
            </Text>
            <Text fontSize='l' textAlign={'left'}>
                {trueIdeals[0]}
                <br />
                {trueIdeals[1]}
            </Text>

        </Container>
    );
}
