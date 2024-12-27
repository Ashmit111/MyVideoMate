import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary,  } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import PlaylistCard from '@/components/ui/playlistCard'; 
import VideoCard2 from '@/components/ui/videoCard2';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useParams } from 'react-router-dom';

function PlaylistVideos() {
    const [isLoading, setIsLoading] = useState(false); 
    const [videos, setVideos] = useState([]); 
    const [playlist, setPlaylist] = useState({});
    const { playlistId } = useParams();

    const sideItems = [
      { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
      { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
      { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
      { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
      { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
      { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
      // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
    ];  

    const fetchVideos = async () => {
      try { 
        const response = await axiosInstance.get(`/playlist/${playlistId}`);
        console.log(response.data.data); 
        const { name, description, videos } = response.data.data;
     
        setPlaylist({ name, description }); 
        const videosWithFormattedDuration = videos.map((video) => {
          const formattedDuration = formatDuration(video.duration); // Format the duration
          return { ...video, formattedDuration }; // Add formatted duration to each video object
        });
    
        console.log(videosWithFormattedDuration);
        setVideos(videosWithFormattedDuration);
        
      } catch (error) {
        console.log("Error fetching videos:", error);
      }
    };
    

    function formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } 

    useEffect(() => { 
      fetchVideos();
      }, []);

  return (
    <div className='h-screen bg-black w-full overflow-y-scroll overflow-x-hidden'>
      <nav className='w-full fixed bg-black h-16 flex items-center z-50 border-b border-gray-600'>
        <div className='flex items-center py-3'>
          <div className="flex gap-2 items-center px-3 ml-2">
            <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
            <h2 className='pt-1 text-lg text-white'>MyTube</h2>
          </div>
        </div>
         <div className='mx-auto'>
            <h2 className='text-white font-bold text-2xl pt-3'>Playlists</h2>
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
        <div className='bg-black'>  
            <div className="flex pl-64 pt-20 pb-8 px-4 bg-black w-[calc(100vw-17px)] overflow-x-hidden">
                <div className="w-1/2 p-4 mr-20 ml-28 fixed"> 
                    <PlaylistCard playlist={playlist} bgColor="bg-[#1e1e1e]" /> 
                </div>
                <div className='flex-col overflow-y-auto space-y-8 mr-14 ml-[calc(50%+6rem)]'>
                {videos.map(video => (
                  <Link key={video._id} to={`/video/${video._id}`}>
                    <VideoCard2 video={video} />
                  </Link>
                ))}
                </div>
                
            </div>
        </div> 
    </div>
  )
}

export default PlaylistVideos
