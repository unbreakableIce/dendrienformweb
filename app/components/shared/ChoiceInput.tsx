import { MouseEvent } from "react";

type ChoiceInputProps = {
	text: string;
	limit: boolean;
	isSelected: boolean;
	handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const ChoiceInput = ({
	text,
	limit,
	isSelected,
	handleClick,
}: ChoiceInputProps) => {
	const onclick = (e: MouseEvent<HTMLButtonElement>) => {
		if (limit && !isSelected) {
			return;
		}

		handleClick(e);
	};

	return (
		<div>
			<button
				onClick={(e) => onclick(e)}
				type="button"
				value={text}
				className={`flex gap-6 border-2 border-[#454545] px-8 py-2 rounded-lg min-w-[100px] sm:min-w-[250px] max-w-[500px] hover:bg-[#dedede]/60 items-center ${isSelected ? "bg-[#d0d0d0]" : ""
					}`}
			>
				<div>
					<h3 className="text-lg font-semibold">{text}</h3>
				</div>
			</button>
		</div>
	);
};
export default ChoiceInput;
