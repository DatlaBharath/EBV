import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import CandiData from "./CandiData";
export default function RecruiterMid(){
    const [result, setResult] = useState([]);
    const router = useRouter();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getCandidate} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getCandidate"
    })
    useEffect(() => {
      async function fetchData() {
          setResult(await getCandidate());
      }
      fetchData();
  });
    useEffect(() => {
        const handleAccountChange = () => {
          router.push('/');
        };
        // Listen for changes to the wallet account
        window.ethereum.on('accountsChanged', handleAccountChange);
        // Clean up the event listener when the component unmounts
        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountChange);
        };
    }, [router]);
    
    return(
        <div>
        <CandiData ren = {result}/>
        </div>
    ); 

}