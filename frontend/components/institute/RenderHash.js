import {useWeb3Contract, useMoralis} from "react-moralis";
import {abi, contractAddresses } from "../../constants";
import { useNotification } from "@web3uikit/core";

export default function RenderHash(props){
    const dispatch = useNotification();
    const {chainId : chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const ebvAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {runContractFunction: hashVerify} = useWeb3Contract({
        abi : abi,
        contractAddress : ebvAddress,
        functionName : "hashVerify",
        params : {
            _hash: props.hash
        }
    })
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Document Hash has been Compares",
            title: "Verification",
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
    return(
        <div className=" bg-blue-500 m-2 p-4 rounded-2xl flex">
            <div className="text-2xl my-auto text-[#fff] ">Document Hash : {props.hash}</div>
            <div><button className="m-auto mx-16 p-4 rounded-2xl bg-[#fff] text-blue-500" onClick={
                async() =>{await hashVerify({
                    onSuccess : handleSuccess,
                    onError : (error) => {alert(error)},
                })}
            }> Verify</button></div>
        </div>
    )
}