const FormComponent = ({
	data,
	formName,
}: {
	data: string[];
	formName: string;
}) => {
	return (
		<div className="grid grid-cols-1 gap-y-6 gap-x-4 w-1/2 mx-auto">
			<input
				type="text"
				autoComplete="off"
				form={formName}
				name="first"
				placeholder="I am..."
				defaultValue={data[0] || ""}
				className="px-4 py-2 outline-none border-2 border-[#000000] bg-transparent placeholder:text-gray-500 rounded-lg"
			/>
			<input
				type="text"
				autoComplete="off"
				form={formName}
				name="second"
				placeholder="I am..."
				defaultValue={data[1] || ""}
				className="px-4 py-2 outline-none border-2 border-[#000000] bg-transparent placeholder:text-gray-500 rounded-lg"
			/>
			<input
				type="text"
				autoComplete="off"
				form={formName}
				name="third"
				placeholder="I am..."
				defaultValue={data[2] || ""}
				className="px-4 py-2 outline-none border-2 border-[#000000] bg-transparent placeholder:text-gray-500 rounded-lg"
			/>
			<input
				type="text"
				autoComplete="off"
				form={formName}
				name="fourth"
				placeholder="I am..."
				defaultValue={data[3] || ""}
				className="px-4 py-2 outline-none border-2 border-[#000000] bg-transparent placeholder:text-gray-500 rounded-lg"
			/>
			<input
				type="text"
				autoComplete="off"
				form={formName}
				name="fifth"
				placeholder="I am..."
				defaultValue={data[4] || ""}
				className="px-4 py-2 outline-none border-2 border-[#000000] bg-transparent placeholder:text-gray-500 rounded-lg"
			/>
		</div>
	);
};
export default FormComponent;
