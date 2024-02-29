import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useState } from "react"
import { useNotification } from "@web3uikit/core";
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
export default function UplodeDoc(){
    const dispatch = useNotification();
    const [DocName, setDocName] = useState("");
    const [ipfs,setIpfs] = useState("")
    function handleDocNameChange(event) {
        setDocName(event.target.value);
    }
    const [fileHash, setFileHash] = useState('');
    const [fileName, setFileName] = useState('No file chosen');
    const handleFile = async (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : 'No File Chosen')
        if (file) {
        const hash = await calculateFileHash(file);
        setFileHash(hash);
        ipfsStore()
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
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: uplodeCandidateDocument} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "uplodeCandidateDocument",
        params : {
            _docName: DocName ,
            _docHash: "0x"+fileHash,
            _ipfs: ipfs
        }
    })
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Document Uploaded",
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

    async function ipfsStore() {
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const buffer = Buffer.from(reader.result);

                    const helia = await createHelia();
                    const fsIPFS = unixfs(helia);
                    const emptyDirCid = await fsIPFS.addDirectory()
                    const fileCid = await fsIPFS.addBytes(buffer);
                    const updateDirCid = await fsIPFS.cp(fileCid, emptyDirCid, 'file.pdf')

                    setIpfs(updateDirCid.toString());
                    
                };
                reader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.error('No file selected.');
        }
    };
    // <div className="text-3xl text-[#fff]" >Document IdNo : <input type="text" className="m-1 b my-3 p-2 rounded-lg ms-auto" placeholder="Enter DocId" onChange={handleDocIdChange}/></div>
    return(
            <div className="w-fit mx-auto space-y-20  justify-center">
            <label className="mx-3 me-10"><strong>Document Name:</strong></label> <input type="text" onChange={handleDocNameChange} placeholder="Enter Document Name" className="p-2 w-72 bg-[#FF9B26] text-white placeholder:text-white placeholder:text-center rounded-md"/><br />
            <label className="mx-3 me-10"><strong>Add Document:</strong></label> <label for="file-upload" className="cursor-pointer p-2 bg-[#FF9B26] text-white rounded-md inline-block">
            Choose File
        </label> <input id="file-upload" type="file" className="hidden"  onChange={handleFile} /><span className="pl-2">{fileName}</span><br />
            <button className=" w-fit mx-36 px-5 bg-[#FF9B26] rounded-md text-white p-2" onClick={async () =>{
                await uplodeCandidateDocument({
                    onSuccess : handleSuccess,
                    onError : (error) => {alert(error)},
                })
            }}>Upload Document</button>
            </div>
    )
}