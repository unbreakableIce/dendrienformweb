import { LoaderFunctionArgs } from "@remix-run/node";
import { getAllUserProfiles } from "~/Data/queries/cosmos";
import { UserDTO } from "~/Data/types/user";

// Helper function to escape commas and double quotes
const escapeCsvValue = (value: string | undefined): string => {
    if (value === undefined || value === null) {
        return '';
    }
    const stringValue = value.toString();
    if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

// Utility function to convert JSON to CSV
// Function to convert data to CSV format
function convertToCSV(users: UserDTO[]): string {

    if (users.length === 0) return '';

    // Extract headers
    const headers = [
        'user_id',
        'full_name',
        'user_name',
        'gender',
        'email',
        'birth+date',
        'location',
        'organization_name',
        'organization+role',
        'last_login_date',
        'purpose_statement_edited',
        'purpose_statement',

    ];

    for (let i = 1; i <= 15; i++) {
        headers.push(`root_value_${i}`);
    }

    for (let i = 1; i <= 5; i++) {
        headers.push(`root_value_${i}_write`);
    }

    for (let i = 1; i <= 10; i++) {
        headers.push(`root_value_${i}_top10`);
    }

    for (let i = 1; i <= 10; i++) {
        headers.push(`root_value_${i}_rank`);
    }

    for (let i = 1; i <= 15; i++) {
        headers.push(`identity_${i}`);  //core characteristics are identities
    }

    for (let i = 1; i <= 5; i++) {
        headers.push(`top_identity_${i}`);
    }

    for (let i = 1; i <= 6; i++) {
        headers.push(`LSE_${i}`);
        headers.push(`LSE_${i}_edited`);
    }

    for (let i = 1; i <= 30; i++) {
        headers.push(`aspiration_${i}`);
    }


    for (let i = 1; i <= 2; i++) {
        headers.push(`true_ideal_${i}`);
    }



    // Create CSV rows
    const rows = users.map(user => {

        console.log('User:', user);

        const coreValues = (user.coreValues || []).concat(Array(15 - (user.coreValues?.length || 0)).fill({ value: '' }));
        const coreCharacteristics = (user.coreCharacteristics || []).concat(Array(15 - (user.coreCharacteristics?.length || 0)).fill(''));

        return [
            user.userId,
            user.fullName,
            user.userName,
            user.gender,
            user.email,
            user.birthDate,
            user.location,
            user.organizationName,
            user.organizationRole,
            user.lastLogin,
            user.purposeStatement?.edited,
            escapeCsvValue(user.purposeStatement?.statement),

            // root values
            coreValues[0].value,
            coreValues[1].value,
            coreValues[2].value,
            coreValues[3].value,
            coreValues[4].value,
            coreValues[5].value,
            coreValues[6].value,
            coreValues[7].value,
            coreValues[8].value,
            coreValues[9].value,
            coreValues[10].value,
            coreValues[11].value,
            coreValues[12].value,
            coreValues[13].value,
            coreValues[14].value,

            // root values write
            '', '', '', '', '',

            // root value top 10
            coreValues[0].value,
            coreValues[1].value,
            coreValues[2].value,
            coreValues[3].value,
            coreValues[4].value,
            coreValues[5].value,
            coreValues[6].value,
            coreValues[7].value,
            coreValues[8].value,
            coreValues[9].value,

            // root value rank top 10
            '', '', '', '', '', '', '', '', '', '',

            // identity (core characteristics) top 15
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',

            // identity top 5   
            coreCharacteristics[0],
            coreCharacteristics[1],
            coreCharacteristics[2],
            coreCharacteristics[3],
            coreCharacteristics[4],

            // LSE top 6
            escapeCsvValue(user.lifespaceExpressions?.community?.statement || ''),
            user.lifespaceExpressions?.community?.edited || '',
            escapeCsvValue(user.lifespaceExpressions?.leisure?.statement || ''),
            user.lifespaceExpressions?.leisure?.edited || '',
            escapeCsvValue(user.lifespaceExpressions?.prosperity?.statement || ''),
            user.lifespaceExpressions?.prosperity?.edited || '',
            escapeCsvValue(user.lifespaceExpressions?.relationships?.statement || ''),
            user.lifespaceExpressions?.relationships?.edited || '',
            escapeCsvValue(user.lifespaceExpressions?.vocation?.statement || ''),
            user.lifespaceExpressions?.vocation?.edited || '',
            escapeCsvValue(user.lifespaceExpressions?.wellbeing?.statement || ''),
            user.lifespaceExpressions?.wellbeing?.edited || '',

            // aspirations top 30
            escapeCsvValue(user.aspirations?.community?.builtEnvironment || ''),
            escapeCsvValue(user.aspirations?.community?.civicOrganizations || ''),
            escapeCsvValue(user.aspirations?.community?.government || ''),
            escapeCsvValue(user.aspirations?.community?.causes || ''),
            escapeCsvValue(user.aspirations?.community?.naturalEnvironment || ''),

            escapeCsvValue(user.aspirations?.leisure?.curiosities || ''),
            escapeCsvValue(user.aspirations?.leisure?.hobbies || ''),
            escapeCsvValue(user.aspirations?.leisure?.socialActivities || ''),
            escapeCsvValue(user.aspirations?.leisure?.sports || ''),
            escapeCsvValue(user.aspirations?.leisure?.travel || ''),

            escapeCsvValue(user.aspirations?.prosperity?.income || ''),
            escapeCsvValue(user.aspirations?.prosperity?.materialPossessions || ''),
            escapeCsvValue(user.aspirations?.prosperity?.financialRisk || ''),
            escapeCsvValue(user.aspirations?.prosperity?.wealth || ''),
            escapeCsvValue(user.aspirations?.prosperity?.debt || ''),

            escapeCsvValue(user.aspirations?.relationships?.romanticPartner || ''),
            escapeCsvValue(user.aspirations?.relationships?.closeFriends || ''),
            escapeCsvValue(user.aspirations?.relationships?.acquaintances || ''),
            escapeCsvValue(user.aspirations?.relationships?.immediateFamily || ''),
            escapeCsvValue(user.aspirations?.relationships?.extendedFamily || ''),

            escapeCsvValue(user.aspirations?.vocation?.achievements || ''),
            escapeCsvValue(user.aspirations?.vocation?.awards || ''),
            escapeCsvValue(user.aspirations?.vocation?.credentials || ''),
            escapeCsvValue(user.aspirations?.vocation?.competencies || ''),
            escapeCsvValue(user.aspirations?.vocation?.vocationalNetwork || ''),

            escapeCsvValue(user.aspirations?.wellbeing?.mental || ''),
            escapeCsvValue(user.aspirations?.wellbeing?.physical || ''),
            escapeCsvValue(user.aspirations?.wellbeing?.spiritual || ''),
            escapeCsvValue(user.aspirations?.wellbeing?.reputational || ''),
            escapeCsvValue(user.aspirations?.wellbeing?.vitality || ''),

            // true ideal top 2
            user.trueIdeals?.[0] || '',
            user.trueIdeals?.[1] || ''

        ].join(',');
    });
    console.log('Rows:', rows);
    console.log('Users:', users);

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
}


export async function loader({
    params,
}: LoaderFunctionArgs) {
    const response = await getAllUserProfiles();
    const csvData = convertToCSV(response);

    return new Response(csvData, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
        },
    });
}

