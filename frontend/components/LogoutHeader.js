import Image from "next/image";
import logo from "../src/Imgs/bLOGO.png"
import {ConnectButton} from "@web3uikit/web3";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function LogoutHeader(){
    const router = useRouter();
    function handleClick(){
        router.push("/");
    }
    useEffect(() => {
        const handleAccountChange = () => {
            router.push('/');
        };
        // Listen for changes to the wallet account
        window.ethereum.on('accountsChanged', handleAccountChange);
        // Clean up the event listener when the component unmounts
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountChange);
        };
    }, [router]);
    return(
        <div className="flex">
            <div className="flex ms-auto">
                <div className="w-fit my-auto">
                    <ConnectButton moralisAuth={false} />
                </div>
                <div className="ms-auto m-2">
                    <button className="p-1 rounded-md text-xl px-6 bg-[#474BCA] text-[#fff]" onClick={handleClick}>Logout</button>
                </div>
            </div>
        </div>
    );
}