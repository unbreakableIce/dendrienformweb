import { LoaderFunctionArgs } from "@remix-run/node";
import OpenAI from "openai";
import redis from "~/utils/connection";

// Utility function to convert JSON to CSV
// Function to convert data to CSV format
export async function getAnalysis(userId: string): Promise<string> {

    const [s1, s2, s3, s4] = await Promise.all([
        redis.get(`m1p3#${userId}`),
        redis.lrange(`m2p4#${userId}`, 0, -1),
        redis.get(`m3p1#${userId}`),
        redis.get(`m4p6#${userId}`),
    ]);


    const prompt = `I want you to infer the true ideals of a person based on five sets of information: their top 10 values, their core characteristics, their life purpose, their LifeSpace expressions of their purpose, and their short-term aspirations. First, identify 2-3 latent themes among their top 10 values. Make sure that each theme is a singular, coherent idea, and don’t try to combine too many distinct ideas into a single latent them name. Use additional latent themes if necessary to avoid combining distinct ideas under one latent theme. Next, connect these latent themes to how they describe themselves (their core characteristics), giving extra weight to areas of semantic overlap between their latent value themes and their core characteristics. Then integrate any new information provided by their purpose statement, their LifeSpace expressions of their purpose, and their short-term aspirations to infer their true ideals, giving more weight to information provided by their short-term aspirations if their aspirations seem to conflict with the other information. Create an Excel-formatted table for the output of this analysis, using the following column headings: name, latent value themes, true ideals. In the table, separate the latent value themes and the true ideals that you identify for each person with a semi-colon.`;

    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        stream: false,
    });

    const response = completion.choices[0].message.content;

    return response || '';
};



export async function loader({
    params,
}: LoaderFunctionArgs) {
    const response = await getAnalysis("29429135-9192-4aba-a8e5-73893000dc69");

    return new Response(response, {
        status: 200,
        headers: {
            "Content-Type": "text/html",
        },
    });
}

