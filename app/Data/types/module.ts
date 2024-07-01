export type FormModule = {
	moduleId: {
		value: string;
	};
	moduleName: string;
	description: string;
	pages: Page[];
	values: Value[];
};

export type Page = {
	pageId: number;
	title: string;
	description: string;
	maxSelectionAllowed: number;
};

export type Value = {
	valueId: number;
	label: string;
	description: string;
	icon: string;
};

// Dtos
export type CreatePageDto = {
	title: string;
	description: string;
	maxSelectionAllowed: string;
};

export type UpdatePageDto = {
	pageId: number;
	title: string;
	description: string;
	maxSelectionAllowed: string;
};

export type CreateValueDto = {
	label: string;
	description: string;
	icon: string;
};

export type UpdateValueDto = {
	valueId: number;
	label: string;
	description: string;
	icon: string;
};

export type CreateFormModuleDto = {
	moduleName: string;
	description: string;
	pages: CreatePageDto[];
	values: CreateValueDto[];
};

export type UpdateFormModuleDto = {
	moduleName: string;
	description: string;
	pages: UpdatePageDto[];
	values: UpdateValueDto[];
};
