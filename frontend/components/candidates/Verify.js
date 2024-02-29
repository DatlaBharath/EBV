import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function Verify() {
    const [result, setResult] = useState([])
    const router = useRouter();
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.candidateUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const { runContractFunction: getVerifiedDocuments } = useWeb3Contract({
        abi: abi,
        contractAddress: ebvAddress,
        functionName: "getVerifiedDocuments",
        params: {
            _address: userAddress
        }
    })
    useEffect(() => {
        async function fetchData() {
            setResult(await getVerifiedDocuments());
        }
        fetchData();
    });
    const DocPush = (d) => {
        return (
            <>
                <div className="mx-auto my-auto col-span-1 font-semibold">{d["d"][0]}</div>
                <Link href={`ipfs://${d["d"][2]}/file.pdf`} className="text-center col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white">View</Link>            </>
        )
    }
    return (
        <div className="w-fit space-y-10">
            <div className="mx-10 space-y-5">
                <div className=" text-[#474BCA] text-xl font-bold">Verified Documents</div>
                <div className="grid grid-cols-2 grid-flow-row gap-12 gap-x-24 ">
                    <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Name</div>
                    <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Document</div>
                    {result?.map((doc) => { return (<DocPush d={doc} />) })}
                </div>
            </div>
        </div>
    )
}