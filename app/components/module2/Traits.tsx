import React from 'react'
import TitleStepper from './TitleStepper'
type props={
  traits:any;
  setTraits:any;
}

const Traits:React.FC<props> = ({traits, setTraits}) => {
const traitsList:string[] = [
"trait_1",
"trait_2",
"trait_3",
"trait_4",
"trait_5"
]
const handleChange = (e:any)=>{
  const {name, value} = e?.target;
  // console.log(value !== "")
  setTraits({...traits, [name]:value})
  // let v = Object.values(traits);
  // console.log(v)
}
  return (
    <div>
        <TitleStepper title='Strongest traits'/>
        <div className="grid grid-cols-2 gap-8 mb-8">
          {traitsList.map(t=>(
            <div key={t} className="flex flex-col gap-4">
              <label htmlFor={t} className='text-lg'>I am</label>
              <input onChange={handleChange} type="text" name={t} id={t} className='rounded-lg p-2 border-solid border-2 border-green-600 outline-none' value={traits[t]} />
            </div>
          ))}

        </div>
    </div>
  )
}

export default Traits
