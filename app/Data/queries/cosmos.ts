import { CosmosClient } from "@azure/cosmos";
import { User } from "../types/user";
import { UserDTO } from '~/Data/types/user';


const endpoint = "https://cosmos-dendrien-dev.documents.azure.com:443/";
const key = process.env.COSMOS_DB_DEV_KEY || "";
const databaseId = "dev";
const containerId = "users";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

async function saveOrUpdateUserProfile(userProfile: User) {
  try {
    // Check if the user profile already exists
    const { resource: existingProfile } = await container.item(userProfile.id || '', userProfile.id).read();

    if (existingProfile) {
      // Update existing user profile
      const { resource: updatedProfile } = await container.item(userProfile.id || '', userProfile.id).replace(userProfile);
      console.log("Updated user profile:", updatedProfile);
    } else {
      // Create new user profile
      const { resource: createdProfile } = await container.items.create(userProfile);
      console.log("Created new user profile:", createdProfile);
    }
  } catch (error) {
    console.error("Error saving or updating user profile:", error);
  }
}

async function getAllUserProfiles(): Promise<UserDTO[]> {
  console.log("Fetching all user profiles...");

  try {
    const { resources: userProfiles } = await container.items.readAll().fetchAll();
    console.log("All user profiles:", userProfiles);

    // Map the fetched profiles to UserDTO
    const userDTOs: UserDTO[] = userProfiles.map(profile => ({
      id: profile.id || '',
      email: profile.email || '',
      userId: profile.userId || '',
      fullName: profile.fullName || '',
      userName: profile.userName || '',
      birthDate: profile.birthDate || '',
      location: profile.location,
      gender: profile.gender || '',
      organizationName: profile.organizationName || '',
      organizationRole: profile.organizationRole || '',
      aspirations: profile.aspirations || { community: {}, leisure: {}, prosperity: {}, relationships: {}, vocation: {} },
      lastLogin: '',
      purposeStatement: profile.purposeStatement || { edited: false, statement: '' },
      coreValues: profile.coreValues || [],
      coreCharacteristics: profile.coreCharacteristics || [],
      lifespaceExpressions: profile.lifespaceExpressions || { community: { statement: '', edited: false }, leisure: { statement: '', edited: false }, prosperity: { statement: '', edited: false }, relationships: { statement: '', edited: false }, vocation: { statement: '', edited: false }, wellbeing: { statement: '', edited: false } },
      trueIdeals: profile.trueIdeals || [],
    }));

    return userDTOs; // Convert userProfiles to JSON format

  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
}

async function savePurposeStatement(userId: string, statement: string, edited: boolean) {

  // Check if inputs are not empty
  if (!userId || !statement || edited === undefined) {
    console.error("Missing required inputs");
    return;
  }

  try {
    // Query by userId in Cosmos DB
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [
        { name: "@userId", value: userId }
      ]
    };

    const { resources: results } = await container.items.query(querySpec).fetchAll();

    if (results.length > 0) {
      const existingProfile = results[0];
      // Check if the user profile already exists


      if (existingProfile) {
        // Update existing user profile
        const { resource: updatedProfile } = await container.item(existingProfile.id, existingProfile.userId).replace({
          ...existingProfile,
          purposeStatement: {
            statement,
            edited
          }
        });
        console.log("Updated user profile:", updatedProfile);
      } else {
        console.error("User profile not found:", userId);
      }
    }
  } catch (error) {
    console.error("Error saving life purpose statement:", error);
  }
}

async function createUser(user: {
  email: string,
  password: string,
  userId: string,
  fullName: string,
  userName: string,
  birthDate: string,
  location: string,
  gender: string
}): Promise<UserDTO> {
  try {
    console.log("Creating user profile:", user);
    // Create a new user profile using comonents of UserDTO we have
    const newUser = {
      email: user.email,
      userId: user.userId,
      fullName: `${user.fullName}`,
      userName: user.userName,
      birthDate: user.birthDate || '',
      location: user.location || '',
      gender: user.gender || '',
    }

    const { resource: createdProfile } = await container.items.create(newUser);
    console.log("Created new user profile:", createdProfile);

    // Map the fetched profiles to UserDTO
    const userDTO: UserDTO = {
      // id: createdProfile?.id || '',
      email: createdProfile?.email || '',
      userId: createdProfile?.userId || '',
      fullName: createdProfile?.fullName || '',
      userName: createdProfile?.userName || '',
      birthDate: createdProfile?.birthDate || '',
      location: createdProfile?.location,
      gender: createdProfile?.gender || ''
    };

    return userDTO; // Convert userProfiles to JSON format

  } catch (error) {
    console.error("Error saving user information:", error);
    throw error;
  }
}

export { getAllUserProfiles, createUser, savePurposeStatement };
