import React, { useState } from 'react';
import { Education } from './Education';
import { Experience } from './Experience';

export const About = () => {
    const [active, setActive] = useState(0);
    const details = {
        0: {
            content: "An ambitious B.Tech student specializing in Information Technology, seeking an entry-level position in a growth-oriented organization that values innovation and efficiency. Eager to apply my academic knowledge to real-world challenges and contribute to the technological advancement of the organization. Committed to continuous learning and leveraging IT solutions to drive operational excellence.",
        },
        1: {
            content: <Education />,
        },
        2: {
            content: <Experience />,
        }
    };
    const handleClick = (field) => {
        let cal = active;
        if (field === 'pre') {
            cal = active <= 0 ? 0 : active - 1;
        } else {
            cal = active >= 2 ? 2 : active + 1;
        }
        setActive(cal);
    }
    return (
        <div name="about" className='h-screen w-full bg-slate-700 md:px-14 px-5'>
            <div className="flex flex-col justify-center w-full h-full">
                <div className="grid grid-row-2 gap-5">
                    <div className="">
                        <div className={`${active === 0 ? null : "hidden"} text-2xl font-semibold text-white`}># About</div>
                        <div className={`${active === 1 ? null : "hidden"} text-2xl font-semibold text-white`}># Education</div>
                        <div className={`${active === 2 ? null : "hidden"} text-2xl font-semibold text-white`}># Experience</div>
                    </div>
                    <div className="bg-white w-full h-80 rounded-xl bg-opacity-10 shadow-xl border-2 border-white border-opacity-30 border-b-0 border-r-0 text-white p-3">
                        <p>{details[active].content}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 mt-5">
                    <div onClick={() => handleClick("pre")} className={`text-center bg-white w-24 p-2 cursor-pointer rounded-xl font-medium capitalize`}>previous</div>
                    <div onClick={() => handleClick("next")} className={`text-center bg-white w-24 p-2 cursor-pointer rounded-xl font-medium capitalize justify-self-end`}>next</div>
                </div>
            </div>
        </div>
    )
}
