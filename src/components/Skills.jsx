import React from 'react';
import { BiLogoTailwindCss, BiLogoJavascript } from 'react-icons/bi';
import { GrGithub } from 'react-icons/gr';
import html from "../assets/html.png";
import css from "../assets/css-3.png";
import java from "../assets/java.png";
import python from "../assets/python.png";
import react from "../assets/physics.png";
import figma from "../assets/figma.png";


export const Skills = () => {
    return (
        <div name="skills" className='h-screen bg-slate-900 w-full md:px-14 px-5'>
            <div className="flex flex-col justify-center w-full h-full">
                <div className="text-white font-semibold text-2xl"># Skills</div>
                <div className=" grid md:grid-cols-4 grid-cols-3 justify-items-center gap-4 p-3">
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={java} alt="java" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={python} alt="python" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={html} alt="html" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={css} alt="css" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <BiLogoJavascript className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-yellow-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={react} alt="react" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <BiLogoTailwindCss className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-sky-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <img src={figma} alt="figma" className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-blue-500"/>
                    </div>
                    <div className="flex justify-center items-center bg-slate-800 w-32 h-32 rounded text-center">
                        <GrGithub className="w-20 h-20 hover:w-24 hover:h-24 ease-in-out duration-300 text-gray-500 hover:text-gray-700 hover:bg-white rounded-full"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
