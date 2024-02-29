import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '../../components/Header'
import LoginCUser from '../../components/LoginCUser'
import LoginRUser from '../../components/LoginRUser'
import LoginOUser from '../../components/LoginOUser'
const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  return (
    <div className='bg-[url("https://img.freepik.com/free-photo/minimalist-blue-white-wave-background_1017-46756.jpg?w=1060&t=st=1706297501~exp=1706298101~hmac=2a15cdfae0ca22871874b00a20727595f8bbbf6fe3ccf4e5781ce2c2a0fd18cd")] bg-cover'>
      <Header />
      <div className='sm:flex my-14'>
        <LoginCUser />
        <LoginRUser />
        <LoginOUser />
      </div>
    </div>
  )
}