import React from 'react';
import { useState, useEffect } from 'react'; 
import VideoCard from '@/components/ui/videoCard';   
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';   
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';


const Home = () => { 
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState("");
    const [videos, setVideos] = useState([]);  
  
      const fetchVideos = async () => {
        try { 
          const response = await axiosInstance.get("/videos", {
            params: {
                limit: 16, // Limit to 16 videos
            },
        });

        const videosWithFormattedDuration = response.data.data.map((video) => {
            const formattedDuration = formatDuration(video.duration); // Format the duration
            return { ...video, formattedDuration }; // Add formatted duration to each video object
        });
        console.log(videosWithFormattedDuration);
        
        setVideos(videosWithFormattedDuration); // Update state with formatted videos
        setLoading(false);
        } catch (err) {
            // Handle any errors
            setError("Failed to fetch videos");
            setLoading(false);
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
    
      if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black">
                <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
            </div>
        );
      }

      if (error) {
        return <div className="text-center">{error}</div>;
      }


  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar />
      {/* Notification Modal */}
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-slate-500">
          <Sidebar /> 
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

export default Home
