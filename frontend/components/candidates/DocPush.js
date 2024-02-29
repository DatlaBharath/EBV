import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function DocPush(doc)  {
    const router = useRouter();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.candidateUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: hashVerify} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "hashVerify",
        params : {
            _hash: doc.d1
        }
    })
    
    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
        <div className="mx-auto my-auto col-span-1 font-semibold">{doc.d0}</div>
        <Link href={`ipfs://${doc.d2}/file.pdf`} className="text-center col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white">View</Link>
        <button className="col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white" onClick={async () =>{
            await hashVerify({
                onSuccess : handleSuccess,
                onError : (error) => {alert(error)},
            })
        }}>push</button>
        </>
    )
}