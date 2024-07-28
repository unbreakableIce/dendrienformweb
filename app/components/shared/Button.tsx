import { MouseEvent, useState } from "react";
import { Value } from "~/Data/types/module";
import { Tooltip } from "react-tooltip";

const Button = ({
	value,
	limit,
	isSelected,
	tooltipId,
	handleClick,
}: {
	value: Value;
	limit: boolean;
	isSelected: boolean;
	tooltipId: string;
	handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
	const onclick = (e: MouseEvent<HTMLButtonElement>) => {
		if (limit && !isSelected) {
			return;
		}

		handleClick(e);
	};

	return (
		<>
			<button
				type="button"
				data-tooltip-id={`button-tooltip${tooltipId}`}
				data-tooltip-content={value.description}
				onClick={e => onclick(e)}
				className={`outline outline-2 outline-offset-2 outline-[#000000] rounded-lg px-4 py-2 flex flex-col gap-4 justify-center content-center items-center flex-wrap w-44 ${isSelected ? "bg-[#bcbcbc]" : ""
					}`}
				name={value.label}
				value={value.valueId}
			>
				{/* <img
					width="70px"
					height="70px"
					src={value.icon}
					alt={`${value.label} icon`}
				/> */}
				<span>{value.label}</span>
			</button>
			<Tooltip id={`button-tooltip${tooltipId}`} />
		</>
	);
};
export default Button;
