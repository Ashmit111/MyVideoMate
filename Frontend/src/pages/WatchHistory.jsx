import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary,  } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import VideoCard from '@/components/ui/videoCard';
import { Link } from 'react-router-dom'; 
import axiosInstance from '@/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';

function WatchHistory() {
    const [isLoading, setIsLoading] = useState(false); 
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    const sideItems = [
      { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos", path: '/likedVideos' },
      { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel", path: '/dashboard' },
      { icon: <MdSubscriptions className="w-6 h-6" />, label: "Audience", path: '/audience' },
      { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists", path: '/myplaylist' },
      { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History", path: '/watchHistory' }, 
      { icon: <IoSettings className="w-6 h-6"/>, label: "Settings", path: '/dashboard'} 
    ];

    useEffect(() => {
      const fetchWatchHistory = async () => {
          try { 
              const response = await axiosInstance.get('/users/history'); 
              const videosWithFormattedDuration = response.data.data.map((video) => {
                  const formattedDuration = formatDuration(video.duration); // Format the duration
                  return { 
                      ...video, 
                      formattedDuration, // Add formatted duration
                      // owner: video.owner // Include the owner details
                  }; 
              });
  
              console.log(videosWithFormattedDuration);
  
              setVideos(videosWithFormattedDuration);  
          } catch (err) {
              // Handle any errors
              console.log("Failed to fetch watch history"); 
          }
      };
  
      // Function to format the video duration from seconds to "minutes:seconds"
      function formatDuration(seconds) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      } 
  
      fetchWatchHistory(); // Fetch the watch history on component mount
  }, []); 
  
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar/> 
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
          <div>
            {sideItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex cursor-pointer items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                aria-label={item.label}
                onClick={() => navigate(item.path)}
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
      <div className=" pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0 w-[calc(100vw-17px)] ">
      {videos.map(video => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <VideoCard video={video} />
          </Link>
        ))}
     </div>
    
      
    </div>
  )
}

export default WatchHistory
