import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState, useEffect } from "react";
import CanRender from "./CanRender";
import CanRenderDoc from "./CanRenderDoc"

export default function CandiData(props){
    const [address, setAddress] = useState('');
    const [result,setResult] = useState([])
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getVerifiedDocuments} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getVerifiedDocuments",
        params : {
            _address : address
        }
    })
    useEffect(() => {
        async function fetchData() {
            setResult(await getVerifiedDocuments());
        }
        fetchData();
    });
    const [p, setp] = useState(props.ren)
    useEffect(() => {
        setp(props.ren);
    });

    function handleAddressChange(value) {
        setAddress(value);
    }

    return(
        <div className="w-fit flex">
            {p?.map((doc)=>{
                return(<CanRender name={doc[0]} id={doc[1]} onClick={handleAddressChange} />)
            })}
            {address && address !== '' ? (
                <div>
                  <CanRenderDoc res = {result}/>
                </div>
              ) : null}
        </div>

    );
}
