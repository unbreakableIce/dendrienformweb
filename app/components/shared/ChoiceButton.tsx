import { MouseEvent } from "react";

const ChoiceButton = ({
	id,
	image,
	title,
	description,
	isSelected,
	handleClick,
}: {
	id: number;
	image: string;
	title: string;
	description: string;
	isSelected: boolean;
	handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
	return (
		<div className="py-4">
			<button
				type="button"
				value={id}
				onClick={(e) => handleClick(e)}
				className={`flex gap-6 border-2 border-[#454545] px-4 py-2 rounded-lg min-w-[350px] max-w-[500px] hover:bg-[#F1E6E2]/60 items-center ${
					isSelected ? "bg-[#F1E6E2]" : ""
				}`}
			>
				<div className="flex flex-wrap justify-center content-center">
					<img src={image} alt={title} width="64px" height="64px" />
				</div>
				<div className="text-left">
					<h3 className="text-lg font-semibold">{title}</h3>
					<p>{description}</p>
				</div>
			</button>
		</div>
	);
};

export default ChoiceButton;
