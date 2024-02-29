import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react"
import Implimentation from "./Implimentation";
export default function OwnerMid(){
    const [result, setResult] = useState([]);
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getToBeVerified} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getToBeVerified",
    })
    useEffect(() => {
        async function fetchData() {
            setResult(await getToBeVerified());
        }
        fetchData();
    });
    return(
        <div>
            <Implimentation ren={result}/>
        </div>
    );
}