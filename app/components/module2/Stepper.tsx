import React, { useState, useEffect } from 'react'
import Traits from './Traits';
import Activities from './Activities';
import Roles from './Roles';
import Rank from './Rank';
import Top from './Top';
// import { Form, useForm } from "@remix/core";


const Stepper = () => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const [traits, setTraits] = useState<any>({})
    const [activities, setActivities] = useState<any>({})
    const [roles, setRoles] = useState<any>({})
    const [result, setResult] = useState<any>([]);

    const steps: any = [
        {
            id: 1,
            value:
                <Traits traits={traits} setTraits={setTraits} />,
        },
        {
            id: 2,
            value: <Activities activities={activities} setActivities={setActivities} />
        },
        {
            id: 3,
            value: <Roles roles={roles} setRoles={setRoles} />
        },
        {
            id: 4,
            value: <Rank roles={roles} activities={activities} traits={traits} result={result} setResult={setResult} />
        },
        {
            id: 5,
            value: <Top result={result} />
        },
    ];

    const handleNext = () => {
        setActiveTab(prev => prev + 1)
        // switch (activeTab) {
        //     case 0:
        //         if (selectedOptions.length === 15) {
        //             setActiveTab(prev => prev + 1)
        //         } else {
        //             console.log("do not go to step 2")
        //         }
        //         break;
        //     case 1:
        //         if (selectedOptions2.length === 10) {
        //             setActiveTab(prev => prev + 1)
        //         } else {
        //             console.log("do not go to step 3")
        //         }
        //         break;
        //     case 2:
        //         break;

        //     default:
        //         break;
        // }
    }

    return (
        <div className='flex flex-col justify-center'>
            <div className=''>
                <form action="">
                    {steps[activeTab].value}
                </form>
            </div>
            <div className='flex mx-auto justify-between w-full'>
                <button
                    disabled={activeTab === 0 ? true : false}
                    onClick={() => setActiveTab(prev => prev - 1)}
                    className={`text-green-600 text-xl font-semibold px-16 py-2 rounded-full border-solid border-2 border-green-600 bg-white ${activeTab === 0 ? "bg-gray-500 text-white border-none" : ""}`}>
                    Back
                </button>
                <button
                    disabled={activeTab === steps.length - 1 ? true : false}
                    onClick={handleNext}
                    className={`text-white text-xl font-semibold px-16 py-2 rounded-full  bg-green-600 ${activeTab === steps.length - 1 ? "bg-gray-500 text-white" : ""}`}>Next</button>
                {/* {
                  activeTab === steps.length - 1 ? <button className='px-4 py-2 rounded-xl bg-blue-600 text-white' onClick={() => console.log("hello")}>Submit</button> : null
              } */}
            </div>
        </div>
    )
}

export default Stepper
