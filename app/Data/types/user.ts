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
