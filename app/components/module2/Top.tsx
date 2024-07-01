import React, {useEffect, useState} from 'react'
import TitleStepper from './TitleStepper'
type props={
  result:any;
}
const Top:React.FC<props> = ({result}) => {
  const [top, setTop] = useState<any>([]);
  useEffect(()=>{
    if(result?.length>5){
      setTop(result.slice(0,5));
    }
  },[result])
  return (
    <div>
        <TitleStepper title='Top 5'/>
        <div className="grid grid-cols-2 gap-8 mb-8">

        { top?.map((e:any, i:number)=>(

            <h5 key={i} className="w-full rounded-lg border-2 border-solid border-green-500 text-left p-4">
              {i + 1}. {e?.label}
            </h5>

        )) }
        </div>
    </div>
  )
}

export default Top
