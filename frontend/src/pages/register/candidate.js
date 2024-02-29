import CanReg from "../../../components/CanReg";
import Header from "../../../components/Header";

export default function candidate(){

    return(
    <div className='bg-[url("https://img.freepik.com/free-photo/minimalist-blue-white-wave-background_1017-46756.jpg?w=1060&t=st=1706297501~exp=1706298101~hmac=2a15cdfae0ca22871874b00a20727595f8bbbf6fe3ccf4e5781ce2c2a0fd18cd")] bg-cover'>
      <Header />
      <div className='sm:flex'>
        <CanReg />
      </div>
    </div>
    );
}