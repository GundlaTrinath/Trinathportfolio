import React from 'react'
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";

export const Home = () => {
    const fileURL = process.env.PUBLIC_URL + '/Resume.pdf';
    return (
        <div name="home" className='bg-slate-900 h-screen flex items-center md:px-14 px-5 w-full'>
            <div className="flex flex-col text-lg font-medium w-full">
                <div className='text-white'>Hi, I am</div>
                <div className='py-5 text-rose-400 capitalize font-bold md:text-5xl text-4xl'>@trinath gundla</div>
                <div className='py-5 uppercase md:text-6xl text-5xl font-bold text-gray-300'>#full stack developer</div>
                <div className="flex gap-5 py-2">
                    <a href='mailto:trinathgundla@gmail.com' className='transition duration-300 ease-in-out cursor-pointer hover:text-red-500 text-slate-700 bg-white w-fit rounded-full p-2 text-3xl'>
                        <BiLogoGmail />
                    </a>
                    <a href='https://github.com/gundlaTrinath' target='_blank' rel="noreferrer" className='transition duration-300 ease-in-out cursor-pointer hover:text-gray-800 text-slate-700 bg-white w-fit rounded-full border-2 p-2 text-3xl'>
                        <BsGithub />
                    </a>
                    <a href='https://www.linkedin.com/in/trinath-gundla-298828210/' target='_blank' rel="noreferrer" className='transition duration-300 ease-in-out cursor-pointer text-slate-700 hover:text-white bg-white hover:bg-[#0077b5] w-fit rounded-full p-2 text-3xl'>
                        <FaLinkedinIn />
                    </a>
                </div>
                <a href={fileURL} download className="transition duration-300 ease-in-out cursor-pointer uppercase text-white px-3 py-2 border-2 w-fit mt-3 rounded hover:bg-white hover:text-slate-800">Resume</a>
            </div>
        </div>
    )
}
