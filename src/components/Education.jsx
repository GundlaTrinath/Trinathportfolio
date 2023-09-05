import React from 'react'

export const Education = () => {
  const details = [
    {
      id: 1,
      college: "Vidya Jyothi Institute of Technology - Hyderabad",
      content: "Engineering - Bachelor, 2023"
    },
    {
      id: 2,
      college: "S.R Junior College - Karimnagar",
      content: "12th - MPC, 2019"
    },
    {
      id: 3,
      college: "Celestial High School - Siddipet",
      content: "10th, 2017"
    },
  ]
  return (
    <div>
      {details.map((data) => {
        return (
          <div key={data.id} className="p-2">
            <div className='text-xl font-semibold'>{data.college}</div>
            <div>{data.content}</div>
          </div>
        )
      })}
    </div>
  )
}
