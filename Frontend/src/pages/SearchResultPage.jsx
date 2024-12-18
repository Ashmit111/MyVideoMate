import React from 'react';
import { useState, useEffect } from 'react';  
import { FiSearch } from "react-icons/fi";
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass, FaRegUser  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import VideoCard3 from '@/components/ui/videoCard3';
import axios from 'axios'; 
import { useLocation, useNavigate } from 'react-router-dom';

function SearchResultPage() { 
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]); 
  const location = useLocation();
  const navigate = useNavigate()

  const query = new URLSearchParams(location.search).get('query');
   
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
 

    useEffect(() => {
      const fetchVideos = async () => {
        setLoading(true);
        setError('');
  
        try {
          const response = await axios.get(`/api/v1/videos/search?query=${encodeURIComponent(query)}` ); 

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }, 0); // Simulates a delay, adjust as needed
    }
};
 
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
    <nav className='w-full fixed bg-black h-16 flex items-center z-50 border-b border-slate-500'>
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
              // onClick={handleSearch}
            >
            {/* {loading ? (
              <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
              ) : (
              <FiSearch className="h-5 w-5 text-white" />
              )} */}
            </button>
          </form> 
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
      {/* Sidebar */}
      <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-slate-500">
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
    <div className="flex-col pl-64 pt-20 pb-8 px-4 overflow-y-auto space-y-8 w-[calc(100vw-129px)] ml-16 mt-6 mr-12">
      {videos.map(video => (
        <VideoCard3 key={video._id} video={video} />  
      ))}
   </div> 
  
    
  </div>
)

}

export default SearchResultPage
 