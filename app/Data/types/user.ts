export type User = {
	userId: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	birthdate: string;
	location: string;
	password: string;
	gender: string;
	choice: string;
	id?: string;
};

export type UserSession = {
	user: User;
	token: string;
};

export type UserDTO = {
	userId: string;
	fullName: string;
	userName: string;
	email: string;
	birthDate: string;
	location: string;
	organizationName: string;
	organizationRole: string;
	aspirations: string[];
	values: string[];
	lastLogin: string;
	purposeStatement: {
		edited: boolean;
		statement: string;
	};

}

export type UserValues = {
	value: string;
	rank: number;
}

