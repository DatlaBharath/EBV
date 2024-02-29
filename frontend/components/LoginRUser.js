import {useWeb3Contract} from "react-moralis";
import {abi, contractAddresses } from "../constants";
import { useState , useEffect} from "react";
import { useRouter } from "next/router";
import {useMoralis} from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { Itim } from 'next/font/google'
import { FaRegUserCircle,FaUserCircle } from "react-icons/fa";
const itim = Itim({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })
export default function LoginRUser(){
    const router = useRouter();
    const dispatch = useNotification()
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState("");
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: addRecruiterUser} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "addRecruiterUser",
        params : {
            _username: username , 
            _address: address
        }
    })
    const {runContractFunction: recruiterValidate} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "recruiterValidate",
        params : {
            _username: username , 
            _address: address
        }
    })
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Registeration Complete!",
            title: "Registered",
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
    const handleValidation = async ()=>{
        const res = await recruiterValidate();
        if(res){
            router.push('/user/recruiter/'+address)
        }
    }
    const handleReg = ()=>{
        router.push('/register/recruiter')
    }
    function handleInputChange(event) {
        setUsername(event.target.value);
    }
    useEffect(() => {
        const updateAddress = async () => {
          try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            setAddress(accounts[0]);
          } catch (err) {
            console.error(err);
          }
        }
        updateAddress();
        window.ethereum.on("accountsChanged", updateAddress);
    
        return () => {
          window.ethereum.removeListener("accountsChanged", updateAddress);
        };
      }, []);
    return (
        <div className="w-fit m-1 mx-auto">
        <div className={`text-[#474BCA] text-2xl w-fit mx-auto ${itim.className}`}>RECRUITER LOGIN</div>
        <div className="w-fit p-5 m-1 mx-auto rounded-lg bg-[url('https://img.freepik.com/free-vector/gray-white-futuristic-technology-background-vector_53876-85332.jpg?w=900&t=st=1706296067~exp=1706296667~hmac=36dad85da008ba1c6c5a2fcd699193b447a42a77091fa5ba9790c682f2f18005')]">
            <div className='w-fit mx-auto my-8'><FaUserCircle className='w-32 h-32 mx-auto my-auto text-[#474BCA]'/></div>
            <span className='flex my-3 bg-white rounded-full px-2 space-x-2'><FaRegUserCircle className='w-6 h-6 my-auto'/><input type="text" onChange={handleInputChange} className="p-2 rounded-lg active:border-white" placeholder="Enter UserName"/></span><br />
            <button className="bg-[#474BCA] text-[#fff] py-2 px-4 rounded-lg w-full" onClick={handleValidation}>Login</button>
        </div>
        <div className="flex py-2 px-4 my-3 mx-auto">Not yet Registered? <span className="text-orange-400">Create Account</span><button className="text-blue-500 mx-1 underline rounded-lg " onClick={handleReg} >Register</button></div>
        </div>
    );
}