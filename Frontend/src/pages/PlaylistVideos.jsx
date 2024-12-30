import React from 'react';
import { useState, useEffect } from 'react';  
import PlaylistCard from '@/components/ui/playlistCard'; 
import VideoCard2 from '@/components/ui/videoCard2';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useParams } from 'react-router-dom'; 
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function PlaylistVideos() {
    const [isLoading, setIsLoading] = useState(false); 
    const [videos, setVideos] = useState([]); 
    const [playlist, setPlaylist] = useState({});
    const { playlistId } = useParams(); 

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

    const onPlaylistCreated = () => {
      fetchVideos(); // Fetch the updated playlists
    };

    useEffect(() => { 
      fetchVideos();
      }, []);

  return (
    <div className='h-screen bg-black w-full overflow-y-scroll overflow-x-hidden'>
      <Navbar/> 
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
          <Sidebar/> 
        </div>
 
      {/* Main Content */}
        <div className='bg-black'>  
            <div className="flex pl-64 pt-20 pb-8 px-4 bg-black w-[calc(100vw-17px)] overflow-x-hidden">
                <div className="w-1/2 p-4 mr-20 ml-28 fixed"> 
                    <PlaylistCard playlist={playlist} bgColor="bg-[#1e1e1e]" onPlaylistCreated={onPlaylistCreated}/> 
                </div>
                <div className='flex-col gap-6 overflow-y-auto space-y-8 mr-14 ml-[calc(50%+6rem)]'>
                {videos.map(video => (
                  <Link key={video._id} to={`/video/${video._id}`}>
                    <VideoCard2 video={video} playlistId={playlistId} videoId={video._id} onPlaylistCreated={onPlaylistCreated} />
                  </Link>
                ))}
                </div>
                
            </div>
        </div> 
    </div>
  )
}

export default PlaylistVideos
