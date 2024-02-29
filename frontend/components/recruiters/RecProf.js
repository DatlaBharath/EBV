import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function RecProf() {
    const [result, setResult] = useState([])
    const [res2, setRes2] = useState([])
    const [docs, setDocs] = useState([])
    const [name, setName] = useState('')
    const [add,setAdd] = useState('')
    const router = useRouter();
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const userAddress = router.query.recruiterUser;
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const { runContractFunction: getRbnCandidate } = useWeb3Contract({
        abi: abi,
        contractAddress: ebvAddress,
        functionName: "getRbnCandidate",
        params: {
            _name: name
        }
    })
    const { runContractFunction: getVerifiedDocuments } = useWeb3Contract({
        abi: abi,
        contractAddress: ebvAddress,
        functionName: "getVerifiedDocuments",
        params: {
            _address: res2[1]
        }
    })
    const { runContractFunction: getRRecruiter } = useWeb3Contract({
        abi: abi,
        contractAddress: ebvAddress,
        functionName: "getRRecruiter",
        params: {
            _address: userAddress
        }
    })
    useEffect(() => {
        async function fetchData() {
            setResult(await getRRecruiter());
        }
        fetchData();
    });
    const handleName = (e) => {
        setName(e.target.value)
    }
    const DocPush = (d) => {
        return (
            <>
                <div className="mx-auto my-auto col-span-1 font-semibold">{d["d"][0]}</div>
                <Link href={`ipfs://${d["d"][2]}/file.pdf`} className="text-center col-span-1 rounded-md font-semibold bg-[#FF9B26] p-1 text-white">View</Link>            </>
        )
    }
    return (
        <>
            <div className="w-fit mx-auto flex space-x-2">
                <span className='flex bg-gray-200 rounded-full space-x-2 px-3'><FaRegUserCircle className='w-6 h-6 my-auto' /><input type="text" className="p-2 w-96 px-4 text-center rounded-full bg-gray-200 active:border-white placeholder:text-black" placeholder="Search By Username" onChange={handleName} /></span><button className="text-white bg-[#474BCA] p-2 rounded-md" onClick={async ()=>{
                    setRes2(await getRbnCandidate());
                }}>search</button>
                
            </div>
            <div className="flex m-20 mx-40">

                <div className="w-fit space-y-10">
                    <div className=" text-[#474BCA] text-2xl font-semibold">Hi {result?.slice(0, 1).map(k => { return (<span>{k}</span>) })} !!!</div>
                    <FaUserCircle className='w-32 h-32 mx-10 text-[#474BCA]' />
                    <div className="mx-10 space-y-5">
                        <div className=" text-[#474BCA] text-xl font-bold"> User Details</div>
                        <div className="grid grid-rows-2 grid-flow-col gap-4 ">
                            <div className="col-span-1 font-semibold">Email</div>
                            <div className="col-span-1 font-semibold">Company</div>
                            {result?.slice(2).map(k => { return (<div className="col-span-1 font-semibold"> {k} </div>) })}
                        </div>
                    </div>
                </div>
                {res2.length > 0 && (<div className="w-fit grid grid-cols-1 grid-flow-row gap-10 py-20 ms-auto">
                    <div className="mx-10 space-y-5">
                        <div className=" text-[#474BCA] text-xl font-bold"> User Details</div>
                        <div className="grid grid-rows-3 grid-flow-col gap-4 ">
                            <div className="col-span-1 font-semibold">Email</div>
                            <div className="col-span-1 font-semibold">Highest Qualifications</div>
                            <div className="col-span-1 font-semibold">Passed Out Year</div>
                            {res2?.slice(2).map(k => { return (<div className="col-span-1 font-semibold"> {k} </div>) })}
                        </div>
                    </div>
                    <div className="mx-10 space-y-5">
                        <div className="flex space-x-16">
                        <div className=" text-[#474BCA] text-xl font-bold">Verified Documents</div>
                        <button className="text-white bg-[#474BCA] p-2 rounded-md" onClick={async ()=>{
                            setDocs(await getVerifiedDocuments());
                        }}>Render</button></div>
                        <div className="grid grid-cols-2 grid-flow-row gap-12 gap-x-24 ">
                            <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Name</div>
                            <div className="mx-auto my-auto col-span-1 font-bold text-[#FF9B26]">Document</div>
                            {docs?.map((doc) => { return (<DocPush d={doc} />) })}
                        </div>
                    </div>
                </div>)}
            </div>
        </>
    )
}