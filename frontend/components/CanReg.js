import {useWeb3Contract} from "react-moralis";
import {abi, contractAddresses } from "../constants";
import { useState , useEffect} from "react";
import {useMoralis} from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { Itim } from 'next/font/google'
import { FaRegUserCircle,FaUserCircle,FaRegCalendarAlt} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { LuGraduationCap } from "react-icons/lu";


const itim = Itim({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })
export default function CanReg(){
    const dispatch = useNotification()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [qualification, setQualification] = useState('');
    const [POY, setPOY] = useState('');
    const [address, setAddress] = useState("");
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: addCandidateUser} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "addCandidateUser",
        params : {
            _username: username , 
            _address: address,
            _email : email,
            _qualification : qualification,
            _yearPO : POY
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

    function handleInputChange(event) {
        setUsername(event.target.value);
    }
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }
    function handleQualificationChange(event) {
        setQualification(event.target.value);
    }
    function handlePOYChange(event) {
        setPOY(event.target.value);
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
        <div className="w-fit mx-auto">
        <div className={`text-[#474BCA] text-2xl w-fit mx-auto ${itim.className}`}>CANDIDATE REGISTER</div>
        <div className="w-fit p-5 px-24 m-1 mx-auto rounded-lg bg-[url('https://img.freepik.com/free-vector/gray-white-futuristic-technology-background-vector_53876-85332.jpg?w=900&t=st=1706296067~exp=1706296667~hmac=36dad85da008ba1c6c5a2fcd699193b447a42a77091fa5ba9790c682f2f18005')]">
            <div className='w-fit mx-auto my-8'><FaUserCircle className='w-32 h-32 mx-auto text-[#474BCA]'/></div>
            <span className='flex  bg-white rounded-full px-2 space-x-2'><FaRegUserCircle className='w-6 h-6 my-auto'/><input type="text" onChange={handleInputChange} className="p-2 rounded-lg active:border-white" placeholder="Enter UserName"/></span><br />
            <span className='flex  bg-white rounded-full px-2 space-x-2'><AiOutlineMail className='w-6 h-6 my-auto'/><input type="text" onChange={handleEmailChange} className="p-2 rounded-lg active:border-white" placeholder="Enter Email"/></span><br />
            <span className='flex  bg-white rounded-full px-2 space-x-2'><LuGraduationCap className='w-6 h-6 my-auto'/><input type="text" onChange={handleQualificationChange} className="p-2 rounded-lg active:border-white" placeholder="Highest Qualification"/></span><br />
            <span className='flex  bg-white rounded-full px-2 space-x-2'><FaRegCalendarAlt className='w-6 h-6 my-auto'/><input type="number" onChange={handlePOYChange} className="p-2 rounded-lg active:border-white" placeholder="Passed Out Year"/></span><br />
            <button className="bg-[#474BCA] text-[#fff] py-2 px-4 rounded-lg w-full" onClick={async () =>{
                await addCandidateUser({
                    onSuccess : handleSuccess,
                    onError : (error) => {alert(error)},
                })
            }}>Register</button>
        </div>
        </div>
    );
}