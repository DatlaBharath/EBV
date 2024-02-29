export default function CanRender(props){
    
    function handleClick(event) {
        props.onClick(event.target.value);
    }
    
    return(
        <div>
            <button className=" bg-blue-500 m-2 p-4 rounded-2xl " value={props.id} onClick={handleClick}>
                <div className="text-2xl my-auto text-[#2c292b] ">{props.name}</div>
            </button >
        </div>
    );
}
