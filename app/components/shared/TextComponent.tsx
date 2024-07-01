const TextComponent = ({ text }: { text: string }) => {
	return (
		<div className="flex-grow flex flex-col content-center mx-auto w-2/3">
			<p className="text-xl">{text}</p>
		</div>
	);
};
export default TextComponent;
