import React from 'react'
import TitleStepper from './TitleStepper'
// import TextField from '@mui/material/TextField';
type props = {
    activities: any;
    setActivities: any;
}

const Activities: React.FC<props> = ({ activities, setActivities }) => {
    const activitiesList: string[] = [
        "activity_1",
        "activity_2",
        "activity_3",
        "activity_4",
        "activity_5"
    ]
    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        setActivities({ ...activities, [name]: value })
    }
    return (
        <div>
            <TitleStepper title='Primary Activities' />
            <div className="grid grid-cols-2 gap-8 mb-8">
                {activitiesList.map(t => (
                    <div key={t} className="flex flex-col gap-4">
                        <label htmlFor={t} className='text-lg'>I am</label>
                        <input onChange={handleChange} type="text" name={t} id={t} className='rounded-lg p-2 border-solid border-2 border-green-600 outline-none' value={activities[t]} />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Activities
