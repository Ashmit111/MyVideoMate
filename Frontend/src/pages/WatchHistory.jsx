import React from 'react';
import { useState, useEffect } from 'react';  
import VideoCard from '@/components/ui/videoCard';
import { Link } from 'react-router-dom'; 
import axiosInstance from '@/utils/axiosInstance'; 
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function WatchHistory() {
    const [isLoading, setIsLoading] = useState(false); 
    const [videos, setVideos] = useState([]); 

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
              setIsLoading(false);
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

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black w-screen fixed top-0 left-0 z-50">
            <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
        </div>
    );
  } 
  
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar/> 
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
          <Sidebar/> 
        </div>
 
      {/* Main Content */}
      <div className="pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0 w-[calc(100vw-17px)]">
    {videos && videos.length > 0 ? (
        videos.map(video => (
            <Link key={video._id} to={`/video/${video._id}`}>
                <VideoCard video={video} />
            </Link>
        ))
    ) : (
      <div className="col-span-full text-center text-white">
        <p className="text-center text-white mt-52">Watch History is empty</p>
      </div>
    )}
</div>
    
      
    </div>
  )
}

export default WatchHistory
