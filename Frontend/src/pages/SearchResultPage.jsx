import React from 'react';
import { useState, useEffect } from 'react';  
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import VideoCard3 from '@/components/ui/videoCard3'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import Navbar from '@/components/ui/Navbar';

function SearchResultPage() { 
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]); 
  const location = useLocation();
  const navigate = useNavigate()

  const query = new URLSearchParams(location.search).get('query');
   
  const sideItems = [
    { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos", path: '/likedVideos' },
    { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel", path: '/dashboard' },
    { icon: <MdSubscriptions className="w-6 h-6" />, label: "Audience", path: '/audience' },
    { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists", path: '/myplaylist' },
    { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History", path: '/watchHistory' }, 
    { icon: <IoSettings className="w-6 h-6"/>, label: "Settings", path: '/dashboard'} 
  ];

    const profilePic = "";
 

    useEffect(() => {
      const fetchVideos = async () => {
        setLoading(true);
        setError('');
  
        try {
          const response = await axiosInstance.get(`/videos/search?query=${encodeURIComponent(query)}` ); 

          const videosWithFormattedDuration = response.data.data.map((video) => {
            const formattedDuration = formatDuration(video.duration); // Format the duration
            return { ...video, formattedDuration }; // Add formatted duration to each video object
        });
        console.log(videosWithFormattedDuration);
        
        setVideos(videosWithFormattedDuration); // Update state with formatted videos
         
        } catch (err) {
          setError('Error fetching videos. Please try again.');
        } finally {
          setLoading(false);
        }
      };
  
      if (query) {
        fetchVideos();
      }
      function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
     } 
    }, [query]); 
 
    // if (loading) {
    //   return (
    //       <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black">
    //           <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
    //       </div>
    //   );
    // }

    // if (error) {
    //   return <div className="text-center">{error}</div>;
    // }


return (
  <div className='h-screen bg-black w-full overflow-y-scroll'>
    <Navbar/> 
    //sidebar 
      {/* Sidebar */}
      <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-slate-500">
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
    <div className="flex-col pl-64 pt-20 pb-8 px-4 overflow-y-auto space-y-8 w-[calc(100vw-129px)] ml-16 mt-6 mr-12">
    {videos.map(video => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <VideoCard3 video={video} />
          </Link>
        ))}
   </div> 
  
    
  </div>
)

}

export default SearchResultPage
 