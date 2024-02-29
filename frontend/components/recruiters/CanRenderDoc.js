import { useState , useEffect } from "react";
import Verify from "../candidates/Verify";
export default function CanRenderDoc(props){
    const [p, setp] = useState(props.res)
    useEffect(() => {
        setp(props.res);
    });
    return(
    <div className="m-2 p-2 w-fit mx-auto">
        <div>
            {p?.map((doc)=>{
                return(<Verify name={doc[0]} id={doc[1]}/>)
            })}
        </div>
    </div>
    );
}