import RenderingDocs from "./RenderingDocs"
import UplodeDoc from "./UplodeDoc"
import Verify from "./Verify";
import PushDoc from "./PushDoc";
import { useState , useEffect } from "react";
export default function Documents(props){
    const [selectedButton, setSelectedButton] = useState('button1');
    const [p, setp] = useState(props.ren)
    const [p1, setp1] = useState(props.ver)
    const [p2, setp2] = useState(props.nver)

    function handleButton1Click() {
        setSelectedButton('button1');
    }

    function handleButton2Click() {
        setSelectedButton('button2');
    }

    useEffect(() => {
        setp(props.ren);
      });
      useEffect(() => {
        setp1(props.ver);
      });
      useEffect(() => {
        setp2(props.nver);
      });
    return(
        <div className="flex ">
            <div className="m-2 p-2 w-fit">
                {p?.map((doc)=>{
                    return(<RenderingDocs name={doc[0]} ipfs={doc[2]}/>)
                })}
            </div>
            <div className="m-2 p-2 w-fit mx-auto">
                <UplodeDoc />
                <div className="flex my-8">
                <button className={`mx-auto text-3xl text-${selectedButton == 'button1' ? 'blue-500' : '[#000]'}`} onClick={handleButton1Click}>Verify</button>
                <button className={`mx-auto text-3xl text-${selectedButton == 'button2' ? 'blue-500' : '[#000]'}`} onClick={handleButton2Click}>Push Document</button>
                </div>
                {selectedButton == 'button1' && <div>
                {p1?.map((doc)=>{
                    return(<Verify name={doc[0]} id={doc[1]}/>)
                })}
                </div>}
                {selectedButton == 'button2' && 
                <div className="grid grid-cols-3 grid-flow-row gap-4 ">
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Name</div>
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Document</div>
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">push</div>
                
                {p2?.map((doc)=>{
                    return(
                        <>
                        <div className="mx-auto my-auto col-span-1 font-semibold">{doc[0]}</div>
                        <button className="col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white">visit</button>
                        <button className="col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white">push</button>
                        </>
                    )
                })} 
                </div>}
            </div>
        </div>
    )
}