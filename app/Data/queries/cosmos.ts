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

async function getAllUserProfiles() : Promise<UserDTO[]> {
  console.log("Fetching all user profiles...");

  try {
    const { resources: userProfiles } = await container.items.readAll().fetchAll();
    console.log("All user profiles:", userProfiles);

    // Map the fetched profiles to UserDTO
    const userDTOs: UserDTO[] = userProfiles.map(profile => ({
      id: profile.id ,
      email: profile.email,
      userId: profile.userId,
      fullName: profile.fullName,
      userName: profile.userName,
      birthDate: profile.birthDate || '',
      location: profile.location,
      gender: profile.gender || '',
      organizationName: profile.organizationName || '',
      organizationRole: profile.organizationRole || '',
      aspirations: profile.aspirations || [],
      values: profile.values || [],
      lastLogin: '',
      purposeStatement: profile.purposeStatement || { edited: false, statement: '' },
      coreValues: profile.coreValues, 
      coreCharacteristics: profile.coreCharacteristics, 
      lifespaceExpressions: profile.lifespaceExpressions
    }));

    return userDTOs; // Convert userProfiles to JSON format

  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
}


export { getAllUserProfiles };
