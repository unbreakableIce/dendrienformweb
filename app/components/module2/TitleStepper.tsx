import React from 'react'
type props = {
    title: string
}

const TitleStepper: React.FC<props> = ({ title }) => {
    return (
        <>
            <h1 className="text-2xl font-semibold text-center capitalize">{title}</h1>
            <hr className='my-2' />
        </>
    )
}

export default TitleStepper
