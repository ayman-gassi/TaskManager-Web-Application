import faqData from '@/app/_content/faqData.json';
import React, { useEffect, useState } from 'react';
function Faq() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(faqData);
  
    useEffect(() => {
      setFilteredData(
        faqData.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [searchTerm]);
  return (
    <div>
    <div className="relative py-24 bg-gradient-to-b from-primeColor to-thirdColor flex justify-center items-center">
        <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-10 text-white">How can we help you?</h1>
            <div className="bg-[#1F509A] rounded relative mt-6 lg:mt-14 py-4 pl-4 flex items-center w-full">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width={16} height={16} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx={10} cy={10} r={7} />
                        <line x1={21} y1={21} x2={15} y2={15} />
                    </svg>
                </div>
                {/* <input type="text" placeholder="Search for answers" className=" ml-4 w-full bg-transparent text-base leading-none text-white placeholder-white focus:outline-none" /> */}
                <input
                type="text"
                placeholder="Search for answers"
                className=" ml-4 w-full bg-transparent text-base leading-none text-white placeholder-white focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    </div>
    <div className="container mx-auto py-9 flex flex-col items-center justify-center">
        <div role="list" className="w-11/12 md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.length != 0 &&  (
                 filteredData.map((item, index) => (
                <div key={index} role="listitem" className="focus:outline-none">
                    <div className="bg-white focus:outline-none shadow-md flex  p-4 lg:p-8 cursor-pointer">
                            <div className='w-10 p-2 h-8 flex items-center justify-center bg-primeColor text-base text-white rounded-md'>
                                 {index+1}
                            </div>
                            <div className="ml-4">
                            <p className="text-base font-medium leading-none text-primeColor">{item.title}</p>
                            <p className="text-xs lg:text-sm xl:text-base lg:leading-normal text-gray-600 mt-2 2xl:w-7/12">{item.description}</p>
                            </div>
                 </div>
                 </div>
            ))
            )}
        </div>
        <div className="mt-9 md:mt-11 lg:mt-16">
            <div className="text-center">
                <h1 className="text-3xl font-medium leading-loose text-gray-800">Didn’t find an answer?</h1>
                <p className="mx-4 md:mx-0 mb-4 text-base leading-none text-gray-600 mt-4">Our team is just an email away and ready to answer your questions</p>
            </div>
        
            <div className="flex justify-center items-center">
                <button className="mt-4 md:mt-6 py-3 px-6 bg-primeColor hover:bg-thirdColor rounded text-white text-center font-medium text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-800">Contact us</button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Faq
