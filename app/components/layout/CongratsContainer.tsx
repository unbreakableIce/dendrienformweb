import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";
import { Form } from "@remix-run/react";

type ContainerProps = {
    pageTitle: string;
    pageSubtitle?: string;
    nextEnabled: boolean;
    nextValue?: string;
    children: React.ReactNode;
    first?: boolean;
};

const CongratsContainer = ({
                       pageTitle,
                       pageSubtitle,
                       nextEnabled,
                       nextValue,
                       children,
                       first,
                   }: ContainerProps) => {
    return (
        <div className="flex flex-col content-center text-center border-2 border-[#454545] bg-[#F3F3F3] w-full md:w-8/12 mx-auto rounded-xl overflow-clip shadow-xl shadow-gray-500 h-[85vh]">
            <div className="sticky top-0 w-full  bg-[#bcbcbc] py-4 px-0 sm:px-2 md:px-4 lg:px-8 flex justify-between shadow-md shadow-gray-300">
                <Form method="post">
                    {first ? (
                        <button
                            name="_action"
                            value="home"
                            className="px-8 py-2 flex flex-wrap justify-start content-center gap-4 text-gray-800 text-2xl font-bold capitalize hover:text-blue-700"
                        >
                            <HomeIcon className="h-6 mt-1" />
                            <span className="hidden sm:inline text-lg">Home</span>
                        </button>
                    ) : (
                        <button
                            name="_action"
                            value="back"
                            className="px-8 py-2 flex flex-wrap justify-start content-center gap-4 text-gray-800 text-2xl font-bold capitalize hover:text-blue-700 group"
                        >
                            <ChevronLeftIcon className="h-6 mt-1 group-hover:-translate-x-6 transition ease-in-out duration-200" />
                            <span className="hidden sm:inline text-lg">Back</span>
                        </button>
                    )}
                </Form>
                <div>
                    <h3 className="sm:text-lg md:text-xl lg:text-2xl font-semibold md:font-bold">
                        {pageTitle}
                    </h3>
                    {pageSubtitle && <p>{pageSubtitle}</p>}
                </div>
                <Form method="post">
                    <input type="hidden" name="results" value={nextValue} />
                    <button
                        name="_action"
                        value="next"
                        type="submit"
                        disabled={!nextEnabled}
                        className={`px-8 py-2 flex flex-wrap justify-start content-cente gap-4 rounded-3xl text-gray-800 text-2xl font-bold capitalize hover:text-blue-700 group ${
                            nextEnabled ? "" : "hidden"
                        }`}
                    >
                        <span className="hidden sm:inline text-lg">Next Module</span>
                        <ChevronRightIcon className="h-6 mt-1 group-hover:translate-x-6 transition ease-in-out duration-200" />
                    </button>
                </Form>
            </div>
            <div className="px-4 mt-16 h-full overflow-scroll">{children}</div>
        </div>
    );
};
export default CongratsContainer;
