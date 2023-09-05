import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-scroll';


export const Navbar = () => {
    const fileURL = process.env.PUBLIC_URL + '/Resume.pdf';
    const [showNav, setShownav] = useState(false);
    return (
        <div className="flex fixed w-full h-20 bg-slate-800 justify-between items-center text-white px-10">
            <Link className="z-10 font-bold cursor-pointer" to="home" smooth={true} duration={500} >TG</Link>
            <div className="">
                <ul className={`md:flex md:items-center md:pt-0 pt-20 pl-10 md:pl-0 uppercase absolute md:static bg-slate-800 md:bg-transparent w-full left-0 top-0 h-screen md:h-fit items-center justify-evenly text-2xl md:text-base font-bold md:font-normal ${showNav ? "hidden" : null}`}>
                    <li className='cursor-pointer mx-5 my-10 md:my-0'>
                        <Link onClick={() => setShownav(true)} to="home" smooth={true} duration={500} >
                            home
                        </Link>
                    </li>
                    <li className='cursor-pointer mx-5 my-10 md:my-0'>
                        <Link onClick={() => setShownav(true)} to="about" smooth={true} duration={500} >
                            about
                        </Link>
                    </li>
                    <li className='cursor-pointer mx-5 my-10 md:my-0'>
                        <Link onClick={() => setShownav(true)} to="skills" smooth={true} duration={500} >
                            skills
                        </Link>
                    </li>
                    <li className='cursor-pointer mx-5 my-10 md:my-0'>
                        <Link onClick={() => setShownav(true)} to="contact" smooth={true} duration={500} >
                            contact
                        </Link>
                    </li>
                    <li><a className='text-slate-800 bg-white px-5 py-2 rounded w-fit' href={fileURL} download={true}>Resume</a></li>
                </ul>
            </div>
            <div className="md:hidden cursor-pointer z-10" onClick={() => setShownav(!showNav)}>
                {showNav ? <FaBars /> : <FaTimes />}
            </div>
        </div>
    )
}
