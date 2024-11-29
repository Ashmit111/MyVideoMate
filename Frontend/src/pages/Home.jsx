import React from 'react';
import { useState } from 'react';
import { RiVideoAddLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass, FaRegUser  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary, MdOutlineNotificationsActive } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import VideoCard from '@/components/ui/videoCard';



const Home = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");

    const sideItems = [
        { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
        { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
        { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
        // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
      ];
      const profilePic = "";
      const handleSearch = (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setSearchError("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      };
  return (
    <div className='h-screen bg-black w-full'>
      <nav className='w-full fixed bg-black h-16 flex items-center'>
        <div className='flex items-center py-3'>
          <div className="flex gap-2 items-center px-3 ml-2">
            <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
            <h2 className='pt-1 text-lg text-white'>MyTube</h2>
          </div>
        </div>
        <div className="flex-1 max-w-xl mx-auto mt-2 items-center justify-center">
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative flex items-center flex-grow -mt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-[6px] rounded-2xl bg-black border-[1.7px] border-white text-white placeholder-white"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-transparent rounded-full outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#313030] focus:bg-[#313030]"
                aria-label="Submit search"
              >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
                ) : (
                <FiSearch className="h-5 w-5 text-white" />
                )}
              </button>
            </form>
            <button
              className="p-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0 -mt-2 hover:bg-[#313030] focus:bg-[#313030]"
              aria-label="Create video"
              // onClick={handleCreateVideo}
            >
              <RiVideoAddLine className="h-6 w-6 text-white" />
            </button>
            <button
              className="p-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0 -mt-2 hover:bg-[#313030] focus:bg-[#313030]"
              aria-label="Notifications"
              // onClick={handleNotifications}
            >
              <MdOutlineNotificationsActive className="h-6 w-6 text-white" />
            </button>
            
          </div>
        </div>
        <div className="items-center pr-8">
             {profilePic.length>0 ? (
                <img
                src={profilePic} // Fetched from DB
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                aria-label="User profile"
                />
                ) : (
                <FaRegUser
                  className="w-5 h-5 text-white"
                  aria-label="Default user icon"
                />
              )}
            </div>

      </nav>
      //sidebar
      <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4">
        <div>
          {sideItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
              aria-label={item.label}
            >
              {React.cloneElement(item.icon, { className: 'h-5 w-5 text-white' })}
              <span className="ml-4 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto mb-2">
          <button
            className="w-full flex items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#1e1e1e] focus:bg-[#1e1e1e]"
            aria-label="Log Out"
          >
            <BiLogOut className="h-5 w-5 text-red" />
            <span className="ml-4 text-sm">Log Out</span>
          </button>
        </div>
      </div>
      //Main 
      <div className='pt-16 pb-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {videos.map((video, index) =>(
          <VideoCard key={index} video={video} />
        ))}
     </div>     
      
    </div>
  )
}

export default Home
