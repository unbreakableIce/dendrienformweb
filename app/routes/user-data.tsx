import { LoaderFunctionArgs } from "@remix-run/node";
import { getAllUserProfiles } from "~/Data/queries/cosmos";
import { UserDTO } from "~/Data/types/user";

// Utility function to convert JSON to CSV
// Function to convert data to CSV format
function convertToCSV(users: UserDTO[]): string {

    if (users.length === 0) return '';

    // Extract headers
    const headers = [
        'userId',
        'fullName',
        'userName',
        'gender',
        'age',
        'email',
        'birthDate',
        'location',
        'organizationName',
        'organizationRole',
        'aspirations',
        'values',
        'lastLoginDate',
        'purposeStatementEdited',
        'purposeStatement',

    ];

    for (let i = 1; i <= 15; i++) {
        headers.push(`rootValue${i}`);
    }

    for (let i = 1; i <= 5; i++) {
        headers.push(`rootValue${i}_write`);
    }

    for (let i = 1; i <= 10; i++) {
        headers.push(`rootValue${i}_top10`);
    }

    for (let i = 1; i <= 10; i++) {
        headers.push(`rootValue${i}_rank`);
    }

    for (let i = 1; i <= 15; i++) {
        headers.push(`identity${i}`);
    }

    for (let i = 1; i <= 5; i++) {
        headers.push(`topIdentity${i}`);
    }

    for (let i = 1; i <= 6; i++) {
        headers.push(`LSE${i}`);
        headers.push(`LSE${i}_edited`);
    }

    for (let i = 1; i <= 30; i++) {
        headers.push(`aspiration${i}`);
    }


    for (let i = 1; i <= 2; i++) {
        headers.push(`trueIdeal${i}`);
    }



    // Create CSV rows
    const rows = users.map(user => {

        console.log('User:', user);

        return [
            user.userId,
            user.userName,
            user.fullName,
            user.email,
            user.birthDate,
            user.location,
            user.organizationName,
            user.organizationRole,
            user.aspirations, // Join array elements with a semicolon
           //  user.values.join(','), // Join array elements with a semicolon
            user.lastLogin,
            user.purposeStatement?.edited,
            user.purposeStatement?.statement
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

