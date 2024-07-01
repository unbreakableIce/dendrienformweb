import { ClickedValue } from "~/Data/types/pagemeta";

export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

/**
 * Compare 2 arrays of clicked values
 * @param oldArray an array of clicked values
 * @param newArray an array of clicked values
 * @returns true if the arrays are the same and false otherwise
 */
export const compareValuesArray = (
	oldArray: ClickedValue[],
	newArray: ClickedValue[]
) => {
	// Verify if there's an oldArray
	if (oldArray.length === 0) return false;

	// Compare the length, it will save a lot of time
	if (oldArray.length !== newArray.length) return false;

	// Sort the array
	oldArray.sort((a) => a.value.valueId);
	newArray.sort((a) => a.value.valueId);

	// Compare them
	return oldArray.every(
		(element, index) => element.value.valueId === newArray[index].value.valueId
	);
};

/**
 * Compare 2 arrays of string
 * @param oldArray an array of string
 * @param newArray an array of string
 * @returns true if the arrays are the same and false otherwise
 */
export const compareStringArray = (oldArray: string[], newArray: string[]) => {
	// Verify if there's an oldArray
	if (oldArray.length === 0) return false;

	if (oldArray.length !== newArray.length) return false;

	oldArray.sort();
	newArray.sort();

	return oldArray.every((element, index) => element === newArray[index]);
};
