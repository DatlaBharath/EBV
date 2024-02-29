import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import Documents from "./Documents";

export default function CanadidateMid(){
    const [result, setResult] = useState([]);
    const [result1, setResult1] = useState([]);
    const [result2, setResult2] = useState([]);
    const router = useRouter();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.candidateUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getArray} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getArray",
        params : {
            _address: userAddress
        }
    })
    const {runContractFunction: getVerifiedDocuments} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getVerifiedDocuments",
        params : {
            _address: userAddress
        }
    })
    const {runContractFunction: getNonVerifiedDocuments} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getNonVerifiedDocuments",
        params : {
            _address: userAddress
        }
    })
    
    useEffect(() => {
        async function fetchData() {
            setResult(await getArray());
        }
        fetchData();
    });
    useEffect(() => {
        async function fetchData() {
            setResult1(await getVerifiedDocuments());
        }
        fetchData();
    });
    useEffect(() => {
        async function fetchData() {
            setResult2(await getNonVerifiedDocuments());
        }
        fetchData();
    });
    
    return(
        <div>
            <Documents ren={result} ver={result1} nver={result2}/>
        </div>
    );
}
