import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary, MdOutlineCreateNewFolder } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import PlaylistCard from '@/components/ui/playlistCard';
import axiosInstance from '@/utils/axiosInstance';
import CreatePlaylistModal from '@/components/ui/CreatePlaylistModal';

function MyPlaylists() {
    const [isLoading, setIsLoading] = useState(false);  
    const [playlists, setPlaylists] = useState([]);
    const [modal, setModal] = useState(false);  
 
    const sideItems = [
      { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
      { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
      { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
      { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
      { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
      { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
      // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
    ]; 

    const fetchPlaylist = async () =>{
        const response = await axiosInstance.get('/playlist');
        console.log(response.data);
        setPlaylists(response.data.data);
    }
    useEffect(() => { 
      fetchPlaylist();
    }, [setModal]);

    const onPlaylistCreated = () => {
        fetchPlaylist(); // Fetch the updated playlists
    };
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
            <h2 className='text-white font-bold text-2xl pt-3'>My Playlists</h2>
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
      <div className="pl-64 pt-20 pb-8 px-4 w-[calc(100vw-19px)]">
  {/* Button to Create Playlist */}
  <div className="flex justify-end mb-4">
    <button
      className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
      onClick={() => setModal(true)}
    >
      <MdOutlineCreateNewFolder className="w-6 h-6" />
      <span>Create Playlist</span>
    </button>
  </div>

  {/* Playlists Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0">
    {playlists.length > 0 ? (
      playlists.map((playlist) => (
        <PlaylistCard
          key={playlist._id}
          playlist={playlist}
          bgColor="bg-[#1e1e1e]"
        />
      ))
    ) : (
      <div className="col-span-full text-center text-white">
        <p className="text-center text-white mt-52">No playlists available.</p>
      </div>
    )}
  </div>
</div>

    {/* Modal */}
    <CreatePlaylistModal Modal={modal} setModal={setModal} onPlaylistCreated={onPlaylistCreated} />
      
    </div>
  )
}

export default MyPlaylists
