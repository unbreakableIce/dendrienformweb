const SummaryComponent = ({ text, title }: { text: string; title: string }) => {
	return (
		<div className="flex-grow flex flex-col gap-4 content-center mx-auto w-full">
			<h3 className="text-2xl font-bold">{title}</h3>
			<p className="p-4  bg-[#DADDCD] border border-black w-full mx-auto rounded-md">
				{text}
			</p>
		</div>
	);
};
export default SummaryComponent;
