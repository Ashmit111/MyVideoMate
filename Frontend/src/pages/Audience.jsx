import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike, BiSolidLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary,  } from "react-icons/md";
import { IoSettings } from "react-icons/io5";   
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import AudienceCard from '@/components/ui/AudienceCard';

function Audience() {

    const [view, setView] = useState('subscriptions');
    const [subscriptionsData, setSubscriptionsData] = useState([]);
    const [subscribersData, setSubscribersData] = useState([]);

    

    const sideItems = [
        { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
        { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
        { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
          // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
    ];

    useEffect(() => {
       const fetchSubscriptions = async () => {
        try {
            const response = await axiosInstance.get("/subscriptions/subscribedChannels"); 
            setSubscriptionsData(response.data.data); 
            
        } catch (err) {
            console.error("Failed to fetch subscriptions", err);
        }
       }
       
       const fetchSubscribers = async () => {
        try {
            const response = await axiosInstance.get("/subscriptions/channelSubscribers"); 
            setSubscribersData(response.data.data); 
            
        } catch (err) {
            console.error("Failed to fetch subscribers", err);
        }
       }

         fetchSubscriptions();
         fetchSubscribers();
    }, []);
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <nav className='w-full fixed bg-black h-16 flex items-center z-50 border-b border-gray-600'>
              <div className='flex items-center py-3'>
                <div className="flex gap-2 items-center px-3 ml-2">
                  <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
                  <h2 className='pt-1 text-lg text-white'>MyTube</h2>
                </div>
              </div>
               <div className='mx-auto'>
                  <h2 className='text-white font-bold text-2xl pt-3 flex gap-2'>Audience<BiSolidLike className='mt-1'/></h2>
               </div>
            </nav>
            //sidebar 
              {/* Sidebar */}
              <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
                <div>
                  {sideItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex cursor-pointer items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                      aria-label={item.label}
                    >
                      {React.cloneElement(item.icon, { className: 'h-5 w-5 text-white' })}
                      <span className="ml-4 text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-auto mb-2">
                  <button
                    className="w-full flex items-center cursor-pointer px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#1e1e1e] focus:bg-[#1e1e1e]"
                    aria-label="Log Out"
                  >
                    <BiLogOut className="h-5 w-5 text-red" />
                    <span className="ml-4 text-sm">Log Out</span>
                  </button>
                </div>
              </div>
            {/* Main Content */}  
            <div className="pl-64 pt-20 pb-8 px-4 flex flex-col items-center w-[calc(100vw-19px)]"> 
    <div className="p-6 w-full flex flex-col items-center">
        {/* Toggle buttons */}
        <div className="flex space-x-4 mb-6 justify-center items-center">
            <button
                onClick={() => setView('subscriptions')}
                className={`px-4 py-2 rounded-md ${view === 'subscriptions' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
                Subscriptions
            </button>
            <button
                onClick={() => setView('subscribers')}
                className={`px-4 py-2 rounded-md ${view === 'subscribers' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
                Subscribers
            </button>
        </div>

        {/* Display audience cards based on the selected view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-center items-center">
            {view === 'subscriptions'
                ? subscriptionsData.map((subscription) => (
                    subscription.channelDetails && (
                        <AudienceCard key={subscription._id} user={subscription.channelDetails} totalVideos={subscription.totalVideos} />
                    )
                ))
                : subscribersData.map((subscriber) => (
                    subscriber.subscriberDetails && (
                        <AudienceCard key={subscriber._id} user={subscriber.subscriberDetails} totalVideos={subscriber.totalVideos}/>
                    )
                ))}
        </div>
    </div>     
</div>

    </div>
  )
}

export default Audience
