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
	gender: string;
	fullName: string;
	userName: string;
	email: string;
	birthDate: string;
	location: string;
	organizationName: string;
	organizationRole: string;
	aspirations: {
		community: {
			builtEnvironment: string;
			civicOrganizations: string;
			government: string;
			causes: string;
			naturalEnvironment: string;
		},
		leisure: {
			curiosities: string;
			hobbies: string;
			socialActivities: string;
			sports: string;
			travel: string;
		},
		prosperity: {
			income: string;
			materialPossessions: string;
			financialRisk: string;
			wealth: string;
			debt: string;
		},
		relationships: {
			romanticPartner: string;
			closeFriends: string;
			acquaintances: string;
			immediateFamily: string;
			extendedFamily: string;
		},
		vocation: {
			achievements: string;
			awards: string;
			credentials: string;
			competencies: string;
			vocationalNetwork: string;
		},
		wellbeing: {
			mental: string;
			physical: string;
			spiritual: string;
			reputational: string;
			vitality: string;
		}
	};
	coreValues: { value: string; rank: number }[];
	coreCharacteristics: string[];
	lifespaceExpressions: {
		community: { statement: string, edited: boolean },
		leisure: { statement: string, edited: boolean },
		prosperity: { statement: string, edited: boolean },
		relationships: { statement: string, edited: boolean },
		vocation: { statement: string, edited: boolean },
		wellbeing: { statement: string, edited: boolean },
	}
	lastLogin: string;
	purposeStatement: { edited: boolean; statement: string; };

}
