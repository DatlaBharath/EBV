import { useState , useEffect} from "react";
import RenderHash from "./RenderHash";
import UplodeHash from "./UplodeHash";
export default function Implimentation(props){
    const [result, setResult] = useState(props.ren);
    const [selectedButton, setSelectedButton] = useState('button1');
    useEffect(() => {
        setResult(props.ren);
    });
    function handleButton1Click() {
        setSelectedButton('button1');
    }

    function handleButton2Click() {
        setSelectedButton('button2');
    }
    return(
        <div>
            <div className="flex">
                <button className={`mx-auto text-3xl text-${selectedButton == 'button1' ? 'blue-500' : '[#000]'}`} onClick={handleButton1Click}>Verify</button>
                <button className={`mx-auto text-3xl text-${selectedButton == 'button2' ? 'blue-500' : '[#000]'}`} onClick={handleButton2Click}>Uplode Document</button>
            </div>
            {selectedButton == 'button1' && <div>
                {result?.map((doc)=>{
                    return(<RenderHash hash={doc}/>)
                })}
            </div>}
                {selectedButton == 'button2' && <div className="m-10 w-fit mx-auto">
                <UplodeHash />
                </div>}
            <div className="m-2 p-2 w-fit">
                
            </div>
        </div>
    );
}