import React, { useCallback, useState, useEffect } from "react";
import TitleStepper from "./TitleStepper";
import SortableButton from "../shared/SortableButtons";
import SortableM2 from "./SortableM2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Value } from "~/Data/types/module";
type props = {
	roles: any;
	activities: any;
	traits: any;
	result: any;
	setResult: any;
};
const Rank: React.FC<props> = ({
	roles,
	activities,
	traits,
	result,
	setResult,
}) => {
	const [sortableList, setsortableList] = useState<Value[]>([]);

	const [valueList, setValueList] = useState<Value[]>([]);

	useEffect(() => {
		const values: Value[] = [];
		let i = 0;
		for (const key in traits) {
			if (traits[key] !== null) {
				values.push({
					valueId: i,
					label: traits[key],
					description: traits[key],
					icon: "",
				});
				i++;
			}
		}
		let j = i;
		for (const key in activities) {
			if (activities[key] !== null) {
				values.push({
					valueId: j,
					label: activities[key],
					description: activities[key],
					icon: "",
				});
				j++;
			}
		}
		let k = j;
		for (const key in roles) {
			if (roles[key] !== null) {
				values.push({
					valueId: k,
					label: roles[key],
					description: roles[key],
					icon: "",
				});
				k++;
			}
		}
		setValueList(values);
	}, []);
	useEffect(() => {
		setResult(valueList);
	}, [valueList, setResult]);
	const moveButton = useCallback((dragIndex: number, hoverIndex: number) => {
		setValueList((val: Value[]) =>
			update(val, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, val[dragIndex] as Value],
				],
			})
		);
	}, []);

	const renderButton = useCallback((value: Value, index: number) => {
		return (
			<SortableM2
				key={value.valueId}
				value={value}
				index={index}
				moveButton={moveButton}
			/>
		);
	}, []);
	return (
		<div className="w-full">
			<TitleStepper title="Rank Elements" />
			<DndProvider backend={HTML5Backend}>
				<div className="flex justify-center mb-8">
					<div className="grid grid-cols-2 gap-6 w-full">
						{valueList.map((val, i) => renderButton(val, i))}
					</div>
				</div>
			</DndProvider>
		</div>
	);
};

export default Rank;
