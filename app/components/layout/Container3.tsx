const Container3 = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="pb-8 flex flex-col content-center text-center gap-8 border-2 border-[#454545] bg-[#F3F3F3] w-full sm:w-8/12 mx-auto rounded-xl overflow-clip shadow-xl shadow-gray-500 h-[80vh]">
			<div className="sticky top-0 w-full  bg-[#b8c1b6] py-4 px-0 sm:px-2 md:px-4 lg:px-8 flex justify-between shadow-md shadow-gray-300 vertical-align:bottom text-center">
				<h2 className="mx-auto sm:text-lg md:text-xl lg:text-2xl font-semibold md:font-bold">
					Congratulations
				</h2>
			</div>
			<div className="px-4 h-full overflow-scroll">{children}</div>
		</div>
	);
};
export default Container3;
