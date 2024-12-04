import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary,  } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import PlaylistCard from '@/components/ui/playlistCard'; 
import VideoCard2 from '@/components/ui/videoCard2';

function PlaylistVideos() {
    const [isLoading, setIsLoading] = useState(false); 
    const [videos, setVideos] = useState([]); 

    const sideItems = [
      { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
      { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
      { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
      { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
      { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
      { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
      // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
    ]; 

    const playlists = [
        {
          id: 1,
          name: "Chill Vibes Playlist",
          description: "A relaxing mix of chill music to unwind and de-stress.",
        }
    ] 

    useEffect(() => {
        const fetchVideos = async () => {
          const fetchedVideos = [
            {
              thumbnail: 'https://i.ytimg.com/vi/NkwFxeHARqc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA_xzx8CM9e1KyGIqGxGPPr-bYf3A',
              title: 'React Tailwind YouTube Card with Options',
              channelName: 'CodeWithMe',
              channelAvatar: 'https://yt3.ggpht.com/1FEdfq3XpKE9UrkT4eOc5wLF2Bz-42sskTi0RkK4nPh4WqCbVmmrDZ5SVEV3WyvPdkfR8sw2=s68-c-k-c0x00ffffff-no-rj',
              views: '123K',
              timeAgo: '2 days ago',
              duration: '12:34',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
           ];
          setVideos(fetchedVideos);
        };
    
        fetchVideos();
      }, []);
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
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
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4">
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

            <div className="flex pl-64 pt-20 pb-8 px-4 bg-black w-full">
                <div className="w-1/2 p-4 mx-20">
                    {playlists.map((playlist, index) => (
                    <PlaylistCard key={index} playlist={playlist} />
                    ))}
                </div>
                <div className='flex-col overflow-y-auto'>
                    {videos.map((video, index) => (
                    <VideoCard2 key={index} video={video} />
                    ))}
                </div>
                
            </div>

      {/* <div className=" pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0">
          {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} />
          ))}
     </div> */}
    
      
    </div>
  )
}

export default PlaylistVideos
