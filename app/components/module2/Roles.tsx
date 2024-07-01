import React from 'react'
import TitleStepper from './TitleStepper'
type props={
    roles:any;
    setRoles:any;
}
const Roles:React.FC<props> = ({roles, setRoles}) => {
    const rolesList: string[] = [
        "role_1",
        "role_2",
        "role_3",
        "role_4",
        "role_5"
    ]
    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        console.log(name, value);
        setRoles({...roles, [name]:value})
    }
    return (
        <div>
            <TitleStepper title='Roles & Relationships' />
            <div className="grid grid-cols-2 gap-8 mb-8">
                {rolesList.map(t => (
                    <div key={t} className="flex flex-col gap-4">
                        <label htmlFor={t} className='text-lg'>I am</label>
                        <input onChange={handleChange} type="text" name={t} id={t} className='rounded-lg p-2 border-solid border-2 border-green-600 outline-none' value={roles[t]} />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Roles
