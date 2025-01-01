import React from 'react';
import { useState, useEffect } from 'react';   
import VideoCard3 from '@/components/ui/videoCard3'; 
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function SearchResultPage() { 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]); 
  const location = useLocation(); 

  const query = new URLSearchParams(location.search).get('query'); 
 

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
        <Sidebar/> 
      </div>

    {/* Main Content */}
    <div className="pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0 w-[calc(100vw-17px)]">
    {videos && videos.length > 0 ? (
        videos.map(video => (
            <Link key={video._id} to={`/video/${video._id}`}>
                <VideoCard3 video={video} />
            </Link>
        ))
    ) : (
      <div className="col-span-full text-center text-white">
        <p className="text-center text-white mt-52">No Video Found matching your query</p>
      </div>
    )}
</div>
  
    
  </div>
)

}

export default SearchResultPage
 