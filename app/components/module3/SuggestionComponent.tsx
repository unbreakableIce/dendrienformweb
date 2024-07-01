import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { MouseEvent, useState } from "react";
import { Tooltip } from "react-tooltip";

type SuggestionProps = {
	text: string;
	index: number;
	formName: string;
	handleClick: (e: MouseEvent<HTMLTextAreaElement>) => void;
};

const SuggestionComponent = ({
	text,
	index,
	formName,
	handleClick,
}: SuggestionProps) => {
	const [copied, setcopied] = useState(false);

	const copyToClipboard = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			await navigator.clipboard.writeText(text);
			setcopied(true);
		} catch (e) {
			console.error(e);
			throw e;
		} finally {
			setTimeout(() => {
				setcopied(false);
			}, 2000);
		}
	};

	if (index === 0) {
		return (
			<div
				key={text}
				className="my-8 p-4 flex flex-col flex-wrap justify-center content-center gap-6 w-full"
			>
				<div className="flex items-center w-full justify-center gap-4">
					<textarea
						className="p-4 outline-none border-2 border-gray-600 rounded-lg bg-gray-200 w-2/3"
						name="suggestion0"
						form={formName}
						cols={30}
						rows={3}
						defaultValue={text}
					/>
					<button
						data-tooltip-id="clipboard"
						data-tooltip-content="Copy to clipboard"
						data-tooltip-place="top"
						className="px-4 py-2 rounded-lg border border-gray-500 flex"
						onClick={copyToClipboard}
						type="button"
					>
						{copied ? (
							<CheckIcon className="h-6 w-6 text-green-600" />
						) : (
							<ClipboardIcon className="h-6 w-6 text-gray-500" />
						)}
					</button>
					<Tooltip id="clipboard" />
				</div>
				<div className="flex gap-8">
					<button
						type="submit"
						name="_action"
						form={formName}
						value="next"
						className="px-4 py-2 rounded-md text-md font-semibold border border-black bg-blue-500 max-w-[300px] mx-auto"
					>
						Accept
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div key={text} className="my-2 p-2">
				<textarea
					className="transition ease-in-out delay-150 p-4 bg-[#F1E6E2] border border-black w-1/2 mx-auto rounded-md read-only:cursor-pointer hover:scale-125 duration-300"
					name={`suggestion${index}`}
					form={formName}
					cols={30}
					rows={3}
					value={text}
					onClick={e => handleClick(e)}
					readOnly
				/>
			</div>
		);
	}
};
export default SuggestionComponent;
