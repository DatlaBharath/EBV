import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState } from "react"
import { useNotification } from "@web3uikit/core";

export default function UplodeHash(){
    const [fileHash, setFileHash] = useState('');
    const [fileName, setFileName] = useState('No file chosen');
    // const [docName,setDocName] = useState('')
    const handleFile = async (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : 'No File Chosen')
        if (file) {
        const hash = await calculateFileHash(file);
        setFileHash(hash);
        } else {
        console.error('No file selected.');
        }
    };

    const calculateFileHash = async (file) => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };
    const dispatch = useNotification();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: hashArray} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "hashArray",
        params : {
            _docHash: '0x'+fileHash
        }
    })
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Hash Uploaded",
            title: "Uplode Status",
            position: "topL",
        })
    }
    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }
    // function handleDocNameChange(event) {
    //     setDocName(event.target.value);
    // }
    // <label className="mx-3 me-10"><strong>Document Name:</strong></label> <input type="text" onChange={handleDocNameChange} placeholder="Enter Document Name" className="p-2 w-72 bg-[#FF9B26] text-white placeholder:text-white placeholder:text-center rounded-md"/><br />
    return(
        <div className="w-fit mx-auto space-y-20  justify-center">
        <label className="mx-3 me-10"><strong>Add Document:</strong></label> <label for="file-upload" className="cursor-pointer p-2 bg-[#FF9B26] text-white rounded-md inline-block">
        Choose File
    </label> <input id="file-upload" type="file" className="hidden"  onChange={handleFile} /><span className="pl-2">{fileName}</span><br />
        <button className=" w-fit mx-36 px-5 bg-[#FF9B26] rounded-md text-white p-2" onClick={async () =>{
            await hashArray({
                onSuccess : handleSuccess,
                onError : (error) => {alert(error)},
            })
        }}>Upload Document</button>
        </div>
    )
}