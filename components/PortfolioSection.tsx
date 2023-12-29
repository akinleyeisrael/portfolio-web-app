"use client"
import Software from '@/components/Software';
import Videos from '@/components/Videos';
import { useState } from 'react';


export const PortfolioSection = () => {
    const [renderComponent, setRenderComponent] = useState<JSX.Element>(<Software />);

    const handleSoftwareComponentClick = () => {
        setRenderComponent(<Software />);
    }

    const handleVideoComponentClick = () => {
        setRenderComponent(<Videos />);
    }
    return (
        <section className='mt-10 my-40 min-h-[58rem] md:min-h-[30rem] ' id="seeprojects">
            {/* <h1 className=' text-center text-3xl font-bold'>Portfolio</h1> */}
            <div className="flex flex-col md:flex-row pt-10 md:pt-24">
                <div className="text-4xl pl-10 md:pl-0 md:text-6xl font-thin max-w-md md:pt-36 w-full rounded-lg">
                    <p onClick={handleSoftwareComponentClick} className="hover:text-gray-400 hover:cursor-pointer">Software<span className='text-purple-300'>Projects</span></p>
                    <p onClick={handleVideoComponentClick} className="hover:text-gray-400 hover:cursor-pointer"><span className='text-orange-300'>Music</span>Videos</p>
                </div>
                <div className="ml-auto  h-10 pt-10 px-10">{renderComponent}</div>
            </div>
        </section>

    )
}

export default PortfolioSection