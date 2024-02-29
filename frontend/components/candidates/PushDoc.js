import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import DocPush from "./DocPush";
export default function PushDoc(){
    const [result,setResult] = useState([])
    const router = useRouter();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.candidateUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getNonVerifiedDocuments} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getNonVerifiedDocuments",
        params : {
            _address: userAddress
        }
    })
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Document Pushed!",
            title: "Push Status",
            position: "topL",
        })
    }
    useEffect(() => {
        async function fetchData() {
            setResult(await getNonVerifiedDocuments());
        }
        fetchData();
    });
    return (
        <div className="w-fit space-y-10">
          <div className="mx-10 space-y-5">
            <div className=" text-[#474BCA] text-xl font-bold"> Non Verified Documents</div>
            <div className="grid grid-cols-3 grid-flow-row gap-12 gap-x-24 ">
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Name</div>
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Document</div>
                <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Verify</div>
                
                {result?.map((doc)=> {return (<DocPush d0={doc[0]} d1={doc[1]} d2={doc[2]} />)})}
            </div>
          </div>
      </div>
    )
}