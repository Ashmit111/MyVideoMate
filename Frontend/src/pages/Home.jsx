import React from 'react';
import { useState } from 'react';
import { RiVideoAddLine, RiNotification3Line } from "react-icons/ri";
import { FiMenu, FiSearch } from "react-icons/fi";
import { BiLogOut, BiSolidLike } from "react-icons/bi";
import { FaHistory, FaRegCompass  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import { IoSettings } from "react-icons/io5";



const Home = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");

    const sideItems = [
        { icon: <BiSolidLike className="w-6 h-6" />, label: "Liked Videos" },
        { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
        { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
        { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
      ];

      const handleSearch = (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setSearchError("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      };
  return (
    <div className='h-screen bg-slate-900'>
      <nav className='w-full fixed bg-black h-16'>
        <div className='flex items-center justify-between py-3'>
          <div className="flex gap-2 items-center px-3">
            <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
            <h2 className='pt-1 text-lg text-white'>MyTube</h2>
          </div>
        </div>
        <div className="flex-1 max-w-xl mx-auto -mt-11">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-black border "border-white text-white placeholder-white`}
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                    aria-label="Submit search"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <FiSearch className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                </form>
            </div>
      </nav>
      
    </div>
  )
}

export default Home
