import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import { FaUserCircle} from "react-icons/fa";

export default function CanProf(){
    const [result,setResult] = useState([])
    const router = useRouter();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.candidateUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: getRCandidate} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "getRCandidate",
        params : {
            _address: userAddress
        }
    })
    useEffect(() => {
        async function fetchData() {
            setResult(await getRCandidate());
        }
        fetchData();
    });
    const handleUpload = ()=>{
        router.push(`/user/candidate/${userAddress}/Upload`)
    }
    const handleVerify = ()=>{
        router.push(`/user/candidate/${userAddress}/Verified`)
    }
    const handleNonVerify = ()=>{
        router.push(`/user/candidate/${userAddress}/NonVerified`)
    }

    return (
        
      <div className="flex m-20 mx-40">
        <div className="w-fit space-y-10">
          <div className=" text-[#474BCA] text-2xl font-semibold">Hi {result?.slice(0,1).map(k => {return (<span>{k}</span>)})} !!!</div>
          <FaUserCircle className='w-32 h-32 mx-10 text-[#474BCA]'/>
          <div className="mx-10 space-y-5">
            <div className=" text-[#474BCA] text-xl font-bold"> User Details</div>
            <div className="grid grid-rows-3 grid-flow-col gap-4 ">
              <div className="col-span-1 font-semibold">Email</div>
              <div className="col-span-1 font-semibold">Highest Qualifications</div>
              <div className="col-span-1 font-semibold">Passed Out Year</div>
              {result?.slice(2).map(k =>{return (<div className="col-span-1 font-semibold"> {k} </div>)})}
            </div>
          </div>
        </div>
          <div className="w-fit grid grid-cols-1 grid-flow-row gap-10 py-20 ms-auto">
            <button className="col-span-1 p-2 rounded-md text-white bg-[#474BCA] w-full" onClick={handleUpload}>Upload Document</button>
            <button className="col-span-1 p-2 rounded-md text-white bg-[#474BCA] w-full" onClick={handleVerify}>Verified Documents</button>
            <button className="col-span-1 p-2 rounded-md text-white bg-[#474BCA] w-full" onClick={handleNonVerify}>Non Verified Documents</button>
          </div>
      </div>
    )
}