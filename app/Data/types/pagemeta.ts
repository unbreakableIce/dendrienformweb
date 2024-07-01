import { Page, Value } from "./module";

export type ClickedValue = {
	value: Value;
	isSelected: boolean;
};

export type PageMetaData = {
	pageMetadataId: {
		value: string;
	};
	moduleId: {
		value: string;
	};
	page: Page;
	userId: {
		value: string;
	};
	screenTime: number;
	startTime: Date;
	exitTime: Date;
	clickedValues: ClickedValue;
};

// Dtos
export type ClickedValueDto = {
	valueId: number;
	isSelected: boolean;
};

export type MetaValue = {
	value: Value;
	isClicked: boolean;
	isSelected: boolean;
};

export type CreatePageMetaData = {
	moduleId: string;
	pageId: number;
	userId: string;
	screentime: number;
	startTime: Date;
	exitTime: Date;
	clickedValues: ClickedValueDto;
};
