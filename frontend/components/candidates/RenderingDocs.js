import Link from "next/link"

export default function RenderingDocs(props){

    return(
        <div className=" bg-blue-500 m-2 p-4 rounded-2xl">
            <div className="text-2xl text-[#fff] w-fit">Document Name : {props.name}</div>
            <Link href={`ipfs://${props.ipfs}/file.pdf`}>View</Link>
        </div>
            )
            // <div className="text-2xl text-[#fff] w-fit">Document Id : {props.id}</div>
}