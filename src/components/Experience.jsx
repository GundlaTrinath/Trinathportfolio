import React from 'react'

export const Experience = () => {
    const details = [
        {
            id: 1,
            logo: "https://images.vexels.com/media/users/3/145057/isolated/preview/40162fe877a9228c5cd5f28939af5a0e-office-building-silhouette-by-vexels.png",
            company: "Anddhen Group",
            desg: "Full Stack Intern",
            content: ["● Developed static and dynamic web applications using React and Tailwind CSS.",
                "● Implemented responsive designs for websites to ensure optimal user experience.",
                "● Utilized Figma tool to design screens for the website, ensuring visually appealing user interfaces.",
                "● Utilized Firebase for user authentication and storing user data."]
        },
        {
            id: 2,
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Zee_media_logo.svg",
            company: "Zee Media Corporation Limited",
            desg: "Python & NLP Intern",
            content: ["● Developed static and dynamic web applications using React and Tailwind CSS.",
                "● Implemented responsive designs for websites to ensure optimal user experience.",
                "● Utilized Figma tool to design screens for the website, ensuring visually appealing user interfaces.",
                "● Utilized Firebase for user authentication and storing user data."]
        }
    ]
    return (
        <div className='w-full h-72 overflow-auto touch-auto'>
            {details.map((data) => {
                return (
                    <div key={data.id} className="p-2 overflow-auto touch-none">
                        <div className='flex text-xl font-semibold gap-4 items-center'>
                            <img src={data.logo} alt="Logo" width="50" height="50" />
                            {data.company}
                        </div>
                        <div className="text-gray-300 font-semibold">{data.desg}</div>
                        {Array.isArray(data.content) ? data.content.map((con) => (
                            <div key={con} className="">{con}</div>
                        )) : <div className="">{data.content}</div>}
                    </div>
                )
            })}
        </div>
    )
}
