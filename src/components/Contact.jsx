import React from 'react'
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs'

export const Contact = () => {
    return (
        <div name="contact" className='h-screen bg-slate-700 w-full md:px-14 px-5'>
            <div className="flex flex-col justify-center w-full h-full">
                <div className="text-white font-semibold text-2xl"># Contact</div>
                <div className="text-gray-400 font-medium text-lg text-justify py-5">I am currently looking for new opportunities in Full Stack/ Front End Development, my inbox is always open. Whether you have a opportunity or just want to say hi, please connect by clicking below button.</div>
                <a href="mailto:trinathgundla@gmail.com" className='border-2 text-white border-white w-fit px-3 py-2 rounded mt-3 text-lg text-medium hover:bg-white hover:text-slate-800 hover:drop-shadow-xl ease-in-out duration-300'>Say Hello</a>
                <div className="flex gap-3 py-5">
                    <a href='https://github.com/gundlaTrinath' className="text-3xl ease-in-out duration-500 cursor-pointer mr-4 hover:bg-white rounded-full"><BsGithub /></a>
                    <a href='https://www.linkedin.com/in/trinath-gundla-298828210/' className="text-3xl ease-in-out duration-500 cursor-pointer mr-4 hover:text-blue-800 hover:bg-white rounded"><BsLinkedin /></a>
                    <a href='https://twitter.com/TrinathGundla' className="text-3xl ease-in-out duration-500 cursor-pointer mr-4 hover:text-blue-500"><BsTwitter /></a>
                </div>
                <div className="text-center text-white">Copyright &copy; 2023 Trinath Gundla</div>
            </div>
        </div>
    )
}
